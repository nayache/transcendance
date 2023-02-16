import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from './enums/channel-role.enum';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Status } from './enums/status.enum';

export class ChannelUserDto {
    pseudo: string;
    role: ChannelRole;
    status?: Status;
}

export class ChannelDto {
    name: string;
    users: ChannelUserDto[];
}

@Controller('chat')
export class ChatController {
    constructor(private chatGateway: ChatGateway, private readonly chatService: ChatService,
        private readonly userService: UserService) {}
    
    @Get('channel')
    getChannelList(@User() userId: string) {
        const names: string[] = this.chatService.getChannelNamesByUserId(userId);
        return {channels: this.chatService.getChannelDto(names)};
    }

    @Get('channel/:pseudo')
    async getChannelsByUser(@Param('pseudo') pseudo: string) {
        const user: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!user)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
        const names: string[] = this.chatService.getChannelNamesByUserId(user.id);
        return {channels: this.chatService.getChannelDto(names)};
    }
    
    @Get('channels')
    async allChannel() {
        const names: string[] = this.chatService.getChannelNames();
        return {channels: this.chatService.getChannelDto(names)};
    }

    @Get('channel/isPrivate/:name')
    channelIsPrivate(@Param('name') channelName: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        return {private: this.chatService.isPrivateChannel(channelName)};
    }

    @Post('channel')
    async createChannel(@User() userId: string, @Body('name') channelName: string, @Body('password') password?: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel already exist');
        this.chatService.createChannel(channelName, password);
        this.chatService.joinChannel(userId, ChannelRole.OWNER, channelName, password);
        await this.chatGateway.joinRoom(userId, channelName);
    }

    @Patch('channel/join')
    async joinChannel(@User() userId: string, @Body('name') channelName: string, @Body('password') password?: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        if (!this.chatService.channelAccess(userId, channelName, password))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'channel access denied');
        this.chatService.joinChannel(userId, ChannelRole.USER, channelName, password);
        await this.chatGateway.joinRoom(userId, channelName);
    }

    @Patch('channel/leave')
    async leaveChannel(@User() userId: string, @Body('name') channelName: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        this.chatService.leaveChannel(userId, channelName);
        await this.chatGateway.leaveRoom(userId, channelName);
    }

    @Patch('channel/setAdmin')
    async setAdmin(@User() userId: string, @Body('channel') channelName: string, @Body('target') target: string) {
        if (!channelName || !this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!this.chatService.isAdmin(userId, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not Admin of this channel');
        const user: UserEntity = await this.userService.findByPseudo(target);
        if (!user)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target not found');
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant set himself privileges');
        if (!this.chatService.insideChannel(user.id, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is not in channel');
        this.chatService.setRole(channelName, userId, ChannelRole.ADMIN);
        this.chatGateway.channelEvent(channelName, `${user.pseudo} become an admin`);
    }

    @Patch('channel/kick')
    async kickUser(@User() userId: string, @Body('channel') channelName: string, @Body('target') target: string) {
        if (!channelName || !this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!this.chatService.isAdmin(userId, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not Admin of this channel');
        const user: UserEntity = await this.userService.findByPseudo(target);
        if (!user)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target not found');
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant kick himself');
        if (!this.chatService.insideChannel(user.id, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is not in channel');
        this.chatService.leaveChannel(user.id, channelName);
        this.chatGateway.leaveRoom(user.id, channelName);
        this.chatGateway.channelEvent(channelName, `${user.pseudo} has been kicked!`);
    }

    @Patch('channel/ban')
    async banUser(@User() userId: string, @Body('channel') channelName: string, @Body('target') target: string) {
        if (!channelName || !this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!this.chatService.isAdmin(userId, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not Admin of this channel');
        const user: UserEntity = await this.userService.findByPseudo(target);
        if (!user)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target not found');
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant ban himself');
        if (!this.chatService.insideChannel(user.id, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is not in channel');
        if (this.chatService.isBanned(channelName, user.id))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is already banned');
        this.chatService.banUser(channelName, user.id);
        this.chatGateway.leaveRoom(user.id, channelName);
        this.chatGateway.channelEvent(channelName, `${user.pseudo} has been banned!`);
    }

    @Post('message')
    async sendMessage(@User() userId: string, @Body('target') target: string, @Body('msg') message: string) {
        if (!target)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.INVALID, 'invalid target');
        if (!message || !message.length)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.EMPTY, 'empty message');
        const user: UserEntity = await this.userService.findByPseudo(target);
        if (!user)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target not found');
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.INVALID, 'cant send himself message');
        if (this.chatService.isBlocked(user.id, userId))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.MESSAGE, TypeErr.INVALID, 'user is blocked by target');
        this.chatService.messageToUser(userId, user.id, message);
        await this.chatGateway.sendMessageToUser(userId, user.id, message);
    }

    @Post('channel/message')
    async sendChannelMessage(@User() userId: string, @Body('target') channelName: string, @Body('msg') message: string) {
        if (!channelName)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.INVALID, 'invalid target');
        if (!message || !message.length)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.EMPTY, 'empty message');
        if (!this.chatService.channelExist(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        if (!this.chatService.insideChannel(userId, channelName))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not in channel');
        this.chatService.messageToChannel(userId, channelName, message);
        await this.chatGateway.sendMessageToChannel(userId, channelName, message);
    }
}
