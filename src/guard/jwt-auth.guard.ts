import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException({
                code: 401,
                status: false,
                message: 'Token tidak ditemukan. Harap sertakan token yang valid.',
                data: null,
            });
        }

        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            request.user = payload;
        } catch (err) {
            throw new UnauthorizedException({
                code: 401,
                status: false,
                message: 'Token tidak valid. Harap periksa dan coba lagi.',
                data: null,
            });
        }

        return true;
    }

    private extractTokenFromHeader(request: { headers: { authorization: string } }): string | null {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : null;
    }
}