import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { WsChatError } from 'src/exceptions/ws-chat-error.exception';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { userDto } from './user.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private chatService: ChatService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: userDto = request.user;
    console.log('->', context.getArgByIndex(context.getArgs().length - 2))
    const argData = context.getArgByIndex(context.getArgs().length - 2);
    if (!this.chatService.channelExist(argData.name))
        throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, `[${argData.name}] channel not exist`);
    if (!this.chatService.isChannelAdmin(argData.name, user.id)) {
        console.log('role access denied');
        return false;
    }
    //console.log('user==>', user);
    //console.log(request.client.sockets.values().next().value);
    //const socket: Socket = request.client.sockets.values().next().value;
    //console.log(socket)
    return true;
  }
}