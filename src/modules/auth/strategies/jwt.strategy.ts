import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { TokenPayloadDto } from '../dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-super-secret-jwt-key'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayloadDto) {
    const user = await this.authService.validateUser(payload);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles?.map((r) => r.slug) || [],
      permissions: user.roles?.flatMap((r) => r.permissions?.map((p) => p.slug) || []) || [],
      sessionId: (req as any).sessionId,
    };
  }
}
