import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Device } from '../../devices/entities/device.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto, TokenPayloadDto } from '../dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private sessionRepository;
    private deviceRepository;
    private auditLogRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, sessionRepository: Repository<Session>, deviceRepository: Repository<Device>, auditLogRepository: Repository<AuditLog>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    logout(sessionId: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    validateUser(payload: TokenPayloadDto): Promise<User>;
    private generateTokens;
    private createAuditLog;
}
