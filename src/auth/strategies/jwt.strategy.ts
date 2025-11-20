// Импортируем зависимости
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['accessToken']]),
            ignoreExpiration: false,
            secretOrKey: "access-secret-key"
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}