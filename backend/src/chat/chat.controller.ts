import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from '../enums/channel-role.enum';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Status } from '../enums/status.enum';
import { IsBoolean, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, isString, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidationFilter } from './filter/validation-filter';
import { isAdmin } from './guards/is-admin.guard';
import { ChannelEntity } from './entity/channel.entity';
import { Transform, Type } from 'class-transformer';
import { isOwner } from './guards/is-owner.guard';
import { Mute } from './entity/mute.entity';
import { Error } from 'src/exceptions/error.interface';

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
    status: Status;
    unmuteDate: Date;
}

export class ChannelDto {
    name: string;
    prv: boolean;
    password: boolean;
    users: ChannelUserDto[];
    messages: ChannelMessageDto[];
}

export class channelPreviewDto {
    name: string;
    password: boolean;
    prv: boolean;
}

export class createChannelDto {
    @MinLength(3)
    @MaxLength(20)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    prv: boolean;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(15)
    @IsOptional()
    password: string;
}

export class adminActionDto {
    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    target: string;
}

export class muteActionDto {
    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    target: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;
}

export class messageDto {
    @IsString()
    @IsNotEmpty()
    target: string;

    @MaxLength(300)
    @IsNotEmpty()
    @IsString()
    msg: string;
}

export class prvMsgDto {
    author: string;
    content: string;
    date: Date;
}

export class Discussion {
    pseudo: string;
    avatar: string;
    unread: number;
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

    @Get('channels/all')
    async allChannel() {
        const channels: ChannelEntity[] = await this.chatService.getChannels();
        return {channels: await this.chatService.getChannelDto(channels)};
    }
    
    @Get('channels/all/preview')
    async allChannelPreview() {
        const channs: ChannelEntity[] = await this.chatService.getChannels();
        const channels: channelPreviewDto[] = await this.chatService.getChannelPreviewDto(channs);
        return {channels};
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
    async createChannel(@User() userId: string, @Body() payload: createChannelDto) {
        if (!this.chatService.isValidChannelName(payload.name))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (payload.password && !this.chatService.isValidChannelPassword(payload.password))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid password syntax');
        if (await this.chatService.channelExistt(payload.name))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.DUPLICATED, 'channel already exist');
        await this.chatService.createChannel(payload.name, payload.prv, payload.password);
        const chann: ChannelEntity = await this.chatService.joinChannel(userId, ChannelRole.OWNER, payload.name);
        await this.chatGateway.joinRoom(userId, payload.name);
        return {channel: (await this.chatService.getChannelDto([chann]))[0]};
    }

    @UseGuards(isOwner)
    @Delete('channel')
    async  deleteChannel(@Body('name') channelName: string) {
        const channel: ChannelEntity = await this.chatService.getChannelByName(channelName);
        await this.chatService.deleteChannel(channel);
        await this.chatGateway.deleteRoomEvent(channelName);
        return { deleted: channelName }
    }

    @Patch('channel/join')
    async joinChannel(@User() userId: string, @Body('name') channelName: string, @Body('password') password?: string) {
        if (!channelName || !this.chatService.isValidChannelName(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid channelName');
        if (!await this.chatService.channelExistt(channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'channel not exist');
        if (await this.chatService.insideChannel(userId, channelName))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'user is already inside channel');
        const error: Error = await this.chatService.channelAccess(userId, channelName, password);
        if (error)
            throw new HttpException({error}, HttpStatus.UNAUTHORIZED);
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
        if (!await this.chatService.leaveChannel(userId, channelName))
            await this.chatGateway.leaveRoom(userId, channelName);
        else
            this.chatGateway.deleteRoomEvent(channelName);
        const chann: ChannelEntity = await this.chatService.getChannelByName('General');
        return {channel: (await this.chatService.getChannelDto([chann]))[0]};
    }

    @UseGuards(isAdmin)
    @Patch('channel/setAdmin')
    async setAdmin(@User() userId: string, @Body() payload: adminActionDto) {
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant set/unset admin himself');
        if (await this.chatService.isAdmin(target.id, payload.channel))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target is already admin');
        await this.chatService.setRole(payload.channel, target.id, ChannelRole.ADMIN);
        await this.chatGateway.setAdminEvent(payload.channel, userId, target.id);
        return {newAdmin: target.pseudo}
    }
    
    @UseGuards(isAdmin)
    @Patch('channel/kick')
    async kickUser(@User() userId: string, @Body() payload: adminActionDto) {
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant kick himself');
        if (!await this.chatService.isOwner(userId, payload.channel) && await this.chatService.isAdmin(target.id, payload.channel))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target is admin');
        await this.chatService.leaveChannel(target.id, payload.channel);
        await this.chatGateway.punishEvent(payload.channel, userId, target.id, 'kick');
        return {kicked: target.pseudo}
    }

    @UseGuards(isAdmin)
    @Patch('channel/ban')
    async banUser(@User() userId: string, @Body() payload: adminActionDto) {
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant ban himself');
        if (!await this.chatService.isOwner(userId, payload.channel) && await this.chatService.isAdmin(target.id, payload.channel))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target is admin');
        if (await this.chatService.isBanned(payload.channel, target.id))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is already banned');
        await this.chatService.banUser(payload.channel, target.id);
        await this.chatService.leaveChannel(target.id, payload.channel);
        await this.chatGateway.punishEvent(payload.channel, userId, target.id, 'ban');
        return {banned: target.pseudo}
    }

    @Get('channel/ismute/:pseudo')
    async ismuteUser(@User() userId: string, @Param('pseudo') pseudo: string) {
        const user = await this.userService.findByPseudo(pseudo);
        return this.chatService.isMuted('testchann', user.id)
    }

    @UseGuards(isAdmin)
    @Patch('channel/mute')
    async muteUser(@User() userId: string, @Body() payload: muteActionDto) {
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'cant mute himself');
        if (!await this.chatService.isOwner(userId, payload.channel) && await this.chatService.isAdmin(target.id, payload.channel))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'target is admin');
        if (await this.chatService.isBanned(payload.channel, target.id))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'target is already muted');
        const muted: Mute = await this.chatService.muteUser(payload.channel, target.id, payload.duration);
        const expiration: Date = this.chatService.getMuteExpiration(muted);
        await this.chatService.setUnmuteDate(muted, expiration);
        await this.chatGateway.muteEvent(payload.channel, userId, target.id, expiration);
        return { muted: target.pseudo, expiration };
    }

    @UseGuards(isOwner)
    @Patch('channel/access')
    async setAccess(@Body('name') channelName: string, @Body('prv') prv: boolean) {
        if (typeof(prv) !== 'boolean')
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'prv argument must be boolean value');
        if (await this.chatService.isPrivateChannel(channelName) !== prv) {
            await this.chatService.setChannelAccess(channelName, prv);
            this.chatGateway.channelAccessEvent(channelName, prv, 'prv');
        }
        return { channel: channelName, private: prv };
    }
    
    @UseGuards(isOwner)
    @Patch('channel/access/password')
    async setPassword(@Body('name') channelName: string, @Body('password') password: string = null) {
        if (password != null && !this.chatService.isValidChannelPassword(password))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.CHANNEL, TypeErr.INVALID, 'invalid password syntax');
        await this.chatService.setChannelPassword(channelName, password);
        this.chatGateway.channelAccessEvent(channelName, !!password, 'password');
        return { password: !!password };
    }

    @Get('discussions')
    async getDiscussions(@User() userId: string) {
        const users: Discussion[] = await this.chatService.getDiscussions(userId);
        return {users}
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
        if (!payload.msg.trimEnd().length)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.MESSAGE, TypeErr.INVALID, 'msg should not be blank');
        if (!await this.chatService.insideChannel(userId, payload.target))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'user is not in channel');
        if (await this.chatService.isMuted(payload.target, userId))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.USER, TypeErr.REJECTED, 'user is muted');
        const color: string = await this.chatService.messageToChannel(userId, payload.target, payload.msg);
        await this.chatGateway.sendMessageToChannel(userId, payload.target, payload.msg, color);
        return {}
    }
}