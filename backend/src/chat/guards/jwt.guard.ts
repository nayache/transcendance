import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id: string = await this.authService.jwtVerif(request.handshake.auth.token, true);
    const pseudo: string = await this.userService.getPseudoById(id);
    //console.log(request.client.sockets.values().next().value);
    //const socket: Socket = request.client.sockets.values().next().value;
    //console.log(socket)
    request.user = { id, pseudo };
    return true;
  }
}