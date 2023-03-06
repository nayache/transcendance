import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from '../enums/channel-role.enum';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Status } from '../enums/status.enum';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ValidationFilter } from './filter/validation-filter';
import { isAdmin } from './guards/is-admin.guard';
import { ChannelEntity } from './entity/channel.entity';
import { Transform } from 'class-transformer';

export class ChannelMessageDto {
    author: string;
    color: string;
    content: string;
    created_at: Date;
}

export class ChannelUserDto {
    pseudo: string;
    color: string;
    role: ChannelRole;
    status?: Status;
}

export class ChannelDto {
    name: string;
    users: ChannelUserDto[];
    messages: ChannelMessageDto[];
}

export class adminActionDto {
    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    target: string;
}

export class messageDto {
    @IsString()
    @IsNotEmpty()
    target: string;

    @IsString()
    @MaxLength(300)
    @Transform(({value}) => (value as string).trimEnd())
    @IsNotEmpty()
    msg: string;
}

export class prvMsgDto {
    author: string;
    content: string;
    date: Date;
}

@UsePipes(ValidationPipe)
@UseFilters(ValidationFilter)
@Controller('chat')
export class ChatController {
    constructor(private chatGateway: ChatGateway, private readonly chatService: ChatService,
        private readonly userService: UserService) {}
    
    @Get('channels')
    async getChannelList(@User() userId: string) {
        const channels: ChannelEntity[] = await this.chatService.getChannelsByUserId(userId);
        return {channels: await this.chatService.getChannelDto(channels)};
    }

    @Get('channel/:name')
    async getChannel(@Param('name') channelName: string) {
       if (!channelName || !await this.chatService.channelExistt(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.NOT_FOUND, 'channel not exist');
        const channel: ChannelEntity = await this.chatService.getChannelByName(channelName);
        return {channel: (await this.chatService.getChannelDto([channel]))[0]};
    }

/*    @Get('channelonverraplustard')
    async getChannelsByUser(@Param('pseudo') pseudo: string) {
        const user: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!user)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
        const names: string[] = this.chatService.getChannelNamesByUserId(user.id);
        return {channels: this.chatService.getChannelDto(names)};
    }*/
    
    @Get('channels/all')
    async allChannel() {
        const channels: ChannelEntity[] = await this.chatService.getChannels();
        return {channels: await this.chatService.getChannelDto(channels)};
    }
    
    @Get('channels/all/names')
    async allChannelNames() {
        const channelNames: string[] = await this.chatService.getChannelNames();
        return {channelNames};
    }

    @Get('channel/isPrivate/:name')
    async channelIsPrivate(@Param('name') channelName: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!await this.chatService.channelExistt(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        return {private: this.chatService.isPrivateChannel(channelName)};
    }

    @Post('channel')
    async createChannel(@User() userId: string, @Body('name') channelName: string, @Body('password') password?: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (await this.chatService.channelExistt(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel already exist');
        await this.chatService.createChannel(channelName, password);
        const chann: ChannelEntity = await this.chatService.joinChannel(userId, ChannelRole.OWNER, channelName);
        await this.chatGateway.joinRoom(userId, channelName);
        return {channel: (await this.chatService.getChannelDto([chann]))[0]};
    }

    @Patch('channel/join')
    async joinChannel(@User() userId: string, @Body('name') channelName: string, @Body('password') password?: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!await this.chatService.channelExistt(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        if (await this.chatService.insideChannel(userId, channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'user is already inside channel');
        if (!await this.chatService.channelAccess(userId, channelName, password))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'channel access denied');
        const chann: ChannelEntity = await this.chatService.joinChannel(userId, ChannelRole.USER, channelName);
        await this.chatGateway.joinRoom(userId, channelName);
        return {channel: (await this.chatService.getChannelDto([chann]))[0]};
    }

    @Patch('channel/leave')
    async leaveChannel(@User() userId: string, @Body('name') channelName: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (channelName === 'General')
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.INVALID, 'cant leave General channel');
        if (!await this.chatService.channelExistt(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        if (!await this.chatService.insideChannel(userId, channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'user is not inside channel');
        await this.chatService.leaveChannel(userId, channelName);
        await this.chatGateway.leaveRoom(userId, channelName);
        const chann: ChannelEntity = await this.chatService.getChannelByName('General');
        return {channel: (await this.chatService.getChannelDto([chann]))[0]};
    }

    @UseGuards(isAdmin)
    @Patch('channel/setAdmin')
    async setAdmin(@User() userId: string, @Body() payload: adminActionDto) {
        const user: UserEntity = await this.userService.findByPseudo(payload.target);
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant set/unset admin himself');
        await this.chatService.setRole(payload.channel, user.id, ChannelRole.ADMIN);
        this.chatGateway.channelEvent(payload.channel, `${user.pseudo} become an admin`);
        return {}
    }
    
    @UseGuards(isAdmin)
    @Patch('channel/kick')
    async kickUser(@User() userId: string, @Body() payload: adminActionDto) {
        const user: UserEntity = await this.userService.findByPseudo(payload.target);
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant kick himself');
        await this.chatService.leaveChannel(user.id, payload.channel);
        await this.chatGateway.leaveRoom(user.id, payload.channel);
        this.chatGateway.channelEvent(payload.channel, `${user.pseudo} has been kicked!`);
        return {}
    }

    @UseGuards(isAdmin)
    @Patch('channel/ban')
    async banUser(@User() userId: string, @Body() payload: adminActionDto) {
        const user: UserEntity = await this.userService.findByPseudo(payload.target);
        if (user.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant ban himself');
        if (await this.chatService.isBanned(payload.channel, user.id))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is already banned');
        await this.chatService.banUser(payload.channel, user.id);
        await this.chatGateway.leaveRoom(user.id, payload.channel);
        this.chatGateway.channelEvent(payload.channel, `${user.pseudo} has been banned!`);
        return {}
    }

    @Get('message/:pseudo')
    async getPrivateConversation(@User() userId: string, @Param('pseudo') pseudo: string) {
        if (!pseudo)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.EMPTY, 'argument empty');
        const target: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!target)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'target not found');
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.INVALID, 'target must different than user');
        const messages: prvMsgDto[] = await this.chatService.getConversation(userId, target.id);
        return {messages};
    }

    @Post('message')
    async sendMessage(@User() userId: string, @Body() payload: messageDto) {
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (!target)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target not found');
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.INVALID, 'cant send himself message');
        if (this.chatService.isBlocked(target.id, userId))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.MESSAGE, TypeErr.INVALID, 'user is blocked by target');
        this.chatService.messageToUser(userId, target.id, payload.msg);
        await this.chatGateway.sendMessageToUser(userId, target.id, target.pseudo, payload.msg);
        return {}
    }

    @Post('channel/message')
    async sendChannelMessage(@User() userId: string, @Body() payload: messageDto) {
        if (!await this.chatService.channelExistt(payload.target))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        if (!await this.chatService.insideChannel(userId, payload.target))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not in channel');
        const color: string = await this.chatService.messageToChannel(userId, payload.target, payload.msg);
        await this.chatGateway.sendMessageToChannel(userId, payload.target, payload.msg, color);
        return {}
    }
}