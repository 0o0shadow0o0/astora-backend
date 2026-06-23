import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto, AuthResponseDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto, req: Request): Promise<AuthResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    logout(req: Request): Promise<{
        message: string;
    }>;
    logoutAll(req: Request): Promise<{
        message: string;
    }>;
    changePassword(changePasswordDto: ChangePasswordDto, req: Request): Promise<{
        message: string;
    }>;
}
