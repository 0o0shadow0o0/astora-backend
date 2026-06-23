export declare class RegisterDto {
    email: string;
    name: string;
    username: string;
    password: string;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    deviceId?: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: any;
}
export declare class TokenPayloadDto {
    sub: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}
