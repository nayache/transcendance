import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { Channel } from 'src/entity/channel.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}

    @Post('channel')
    async createChannel(@User() userId: string, @Body('name') name: string, @Body('password') password: string) {
        if (!name)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.EMPTY, 'name parameter is empty');
        if (!this.chatService.isValidName(name))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channel name');
        if (await this.chatService.channelExist(name))
            throw new ErrorException(HttpStatus.CONFLICT, AboutErr.CHANNEL, TypeErr.DUPLICATED, 'channel name already exist');
        const owner: UserEntity = await this.userService.findById(userId);
        const channel: Channel = await this.chatService.createChannel(name, owner, password);
        return {channel};
    }
}
