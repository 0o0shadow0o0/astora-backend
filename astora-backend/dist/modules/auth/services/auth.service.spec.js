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
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const session_entity_1 = require("../../sessions/entities/session.entity");
const device_entity_1 = require("../../devices/entities/device.entity");
const audit_log_entity_1 = require("../../audit-logs/entities/audit-log.entity");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
describe('AuthService', () => {
    let service;
    let mockUserRepository;
    let mockSessionRepository;
    let mockJwtService;
    const mockUser = {
        id: 'user-uuid-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        password: bcrypt.hashSync('password123', 12),
        isActive: true,
        roles: [],
    };
    beforeEach(async () => {
        mockUserRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
        };
        mockSessionRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
        };
        mockJwtService = {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockUserRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(session_entity_1.Session),
                    useValue: mockSessionRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(device_entity_1.Device),
                    useValue: {},
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(audit_log_entity_1.AuditLog),
                    useValue: {},
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('secret'),
                    },
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);
            const result = await service.register({
                email: 'test@example.com',
                username: 'testuser',
                name: 'Test User',
                password: 'password123',
            });
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result).toHaveProperty('user');
            expect(mockUserRepository.create).toHaveBeenCalled();
            expect(mockUserRepository.save).toHaveBeenCalled();
        });
        it('should throw conflict exception if user exists', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            await expect(service.register({
                email: 'test@example.com',
                username: 'testuser',
                name: 'Test User',
                password: 'password123',
            })).rejects.toThrow('User with this email or username already exists');
        });
    });
    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockUserRepository.update.mockResolvedValue({});
            mockSessionRepository.create.mockReturnValue({});
            mockSessionRepository.save.mockResolvedValue({});
            const result = await service.login({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
        });
        it('should throw unauthorized exception for invalid email', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            await expect(service.login({
                email: 'wrong@example.com',
                password: 'password123',
            })).rejects.toThrow('Invalid credentials');
        });
        it('should throw unauthorized exception for invalid password', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            await expect(service.login({
                email: 'test@example.com',
                password: 'wrongpassword',
            })).rejects.toThrow('Invalid credentials');
        });
    });
    describe('validateUser', () => {
        it('should return user for valid payload', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.validateUser({
                sub: 'user-uuid-123',
                email: 'test@example.com',
                username: 'testuser',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600,
            });
            expect(result).toEqual(mockUser);
        });
        it('should throw unauthorized for non-existent user', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            await expect(service.validateUser({
                sub: 'non-existent-id',
                email: 'test@example.com',
                username: 'testuser',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600,
            })).rejects.toThrow('User not found or inactive');
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map