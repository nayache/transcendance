import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id: string = await this.authService.jwtVerif(request.handshake.auth.token);
    const pseudo: string = await this.userService.getPseudoById(id);
    request.user = { id, pseudo };
    return true;
  }
}