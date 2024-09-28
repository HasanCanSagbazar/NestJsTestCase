import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { BlacklistTokenService } from '../token/blacklisttoken.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly blacklistTokenService: BlacklistTokenService, 
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) return false;

    const isBlacklisted = await this.blacklistTokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
        throw new UnauthorizedException;
        return false
    };

    /*const user = await this.validateToken(token);
    if (!user) return false;

    request.user = user;*/
    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token || authHeader.split(' ')[0] !== 'Bearer') return null;

    return token;
  }

  private async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      console.error('Token validation error:', error.message);
      return null;
    }
  }
}
