import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async login(body: { email: string; pass: string }) {
        // Validação mockada para teste inicial do fluxo JWT
        if (body.email !== 'admin@admin.com' || body.pass !== '123456') {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: 1, email: body.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
