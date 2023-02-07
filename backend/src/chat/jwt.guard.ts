import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private authService: AuthService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
        const userId: string = await this.authService.jwtVerif(request.handshake.auth.token);
        request.user = userId;
    } catch {
        console.log('JwtGuard: error authentification')
        request.user = null;
    }
    return true;
  }
}