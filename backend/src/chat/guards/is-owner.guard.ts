import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChatService } from '../chat.service';

@Injectable()
export class isOwner implements CanActivate {
  constructor(private chatService: ChatService, private userService: UserService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('IN OWNER GUARD')
    const request: Request = context.switchToHttp().getRequest<Request>();
    const args: string[] = Object.values(request.body);
    const authorId: string = request.user as string;
    
    if (!await this.chatService.channelExistt(args[0]))
        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
    if (!await this.chatService.isOwner(authorId, args[0]))
        throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not Owner of this channel');
    return true;
  }
}