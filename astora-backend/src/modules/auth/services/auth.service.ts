import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Device } from '../../devices/entities/device.entity';
import { AuditLog, AuditAction } from '../../audit-logs/entities/audit-log.entity';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  TokenPayloadDto,
} from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { username: registerDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async login(
    loginDto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      await this.createAuditLog(AuditAction.LOGIN_FAILED, 'User', undefined, {
        email: loginDto.email,
        reason: 'User not found',
      }, ipAddress, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      await this.createAuditLog(AuditAction.LOGIN_FAILED, 'User', user.id, {
        reason: 'Invalid password',
      }, ipAddress, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    let device: Device | null = null;
    if (loginDto.deviceId) {
      device = await this.deviceRepository.findOne({
        where: { id: loginDto.deviceId, userId: user.id },
      });
    }

    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    });

    await this.createAuditLog(AuditAction.LOGIN, 'User', user.id, {}, ipAddress, userAgent);

    return this.generateTokens(user, device);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken: refreshTokenDto.refreshToken },
      relations: ['user', 'user.roles', 'user.roles.permissions'],
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.status === 'expired' || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = session.user;
    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    await this.sessionRepository.update(session.id, {
      lastActivityAt: new Date(),
    });

    return this.generateTokens(user, session.device || undefined);
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, { status: 'revoked' });
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, status: 'active' },
      { status: 'revoked' },
    );
  }

  async validateUser(payload: TokenPayloadDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  private async generateTokens(
    user: User,
    device?: Device | null,
  ): Promise<AuthResponseDto> {
    const payload: TokenPayloadDto = {
      sub: user.id,
      email: user.email,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this.sessionRepository.create({
      refreshToken,
      expiresAt,
      userId: user.id,
      deviceId: device?.id,
      ipAddress: device?.ipAddress,
      userAgent: device?.userAgent,
    });

    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        roles: user.roles?.map((r) => r.slug) || [],
      },
    };
  }

  private async createAuditLog(
    action: AuditAction,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
    userId?: string,
  ): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
      userAgent,
      userId,
    });
    await this.auditLogRepository.save(auditLog);
  }
}
