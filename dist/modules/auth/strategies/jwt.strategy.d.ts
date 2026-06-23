import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { TokenPayloadDto } from '../dto/auth.dto';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(req: Request, payload: TokenPayloadDto): Promise<{
        id: string;
        email: string;
        username: string;
        roles: string[];
        permissions: string[];
        sessionId: any;
    }>;
}
export {};
