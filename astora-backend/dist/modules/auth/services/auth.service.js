"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_entity_1 = require("../../users/entities/user.entity");
const session_entity_1 = require("../../sessions/entities/session.entity");
const device_entity_1 = require("../../devices/entities/device.entity");
const audit_log_entity_1 = require("../../audit-logs/entities/audit-log.entity");
let AuthService = class AuthService {
    constructor(userRepository, sessionRepository, deviceRepository, auditLogRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.deviceRepository = deviceRepository;
        this.auditLogRepository = auditLogRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: registerDto.email },
                { username: registerDto.username },
            ],
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email or username already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);
        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
        });
        await this.userRepository.save(user);
        return this.generateTokens(user);
    }
    async login(loginDto, ipAddress, userAgent) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['roles', 'roles.permissions'],
        });
        if (!user) {
            await this.createAuditLog(audit_log_entity_1.AuditAction.LOGIN_FAILED, 'User', undefined, {
                email: loginDto.email,
                reason: 'User not found',
            }, ipAddress, userAgent);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            await this.createAuditLog(audit_log_entity_1.AuditAction.LOGIN_FAILED, 'User', user.id, {
                reason: 'Invalid password',
            }, ipAddress, userAgent);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        let device = null;
        if (loginDto.deviceId) {
            device = await this.deviceRepository.findOne({
                where: { id: loginDto.deviceId, userId: user.id },
            });
        }
        await this.userRepository.update(user.id, {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
        });
        await this.createAuditLog(audit_log_entity_1.AuditAction.LOGIN, 'User', user.id, {}, ipAddress, userAgent);
        return this.generateTokens(user, device);
    }
    async refreshToken(refreshTokenDto) {
        const session = await this.sessionRepository.findOne({
            where: { refreshToken: refreshTokenDto.refreshToken },
            relations: ['user', 'user.roles', 'user.roles.permissions'],
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (session.status === 'expired' || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        const user = session.user;
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        await this.sessionRepository.update(session.id, {
            lastActivityAt: new Date(),
        });
        return this.generateTokens(user, session.device || undefined);
    }
    async logout(sessionId) {
        await this.sessionRepository.update(sessionId, { status: 'revoked' });
    }
    async logoutAll(userId) {
        await this.sessionRepository.update({ userId, status: 'active' }, { status: 'revoked' });
    }
    async validateUser(payload) {
        const user = await this.userRepository.findOne({
            where: { id: payload.sub },
            relations: ['roles', 'roles.permissions'],
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return user;
    }
    async generateTokens(user, device) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, uuid_1.v4)();
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
    async createAuditLog(action, entityType, entityId, metadata, ipAddress, userAgent, userId) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(2, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(3, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map