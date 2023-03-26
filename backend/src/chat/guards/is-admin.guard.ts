import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChatService } from '../chat.service';

@Injectable()
export class isAdmin implements CanActivate {
  constructor(private chatService: ChatService, private userService: UserService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('IN ADMIN GUARD')
    const request: Request = context.switchToHttp().getRequest<Request>();
    const args: string[] = Object.values(request.body);
    const authorId: string = request.user as string;
    
    if (!await this.chatService.channelExistt(args[0]))
        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
    if (!await this.chatService.isAdmin(authorId, args[0]))
        throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not Admin of this channel');
    const target: UserEntity = await this.userService.findByPseudo(args[1]);
    if (!target)
        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target not found');
    if (!await this.chatService.insideChannel(target.id, args[0]))
        throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is not in channel');
    
    return true;
  }
}
