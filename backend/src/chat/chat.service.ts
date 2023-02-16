import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from './enums/channel-role.enum';
import { ChannelDto, ChannelUserDto } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Status } from './enums/status.enum';

export class Message {
    constructor(author: User, data: string) {
        this.author = author;
        this.data = data;
    }
    author: User;
    data: string;
}

export class User {
    constructor(id: string, pseudo: string, role?: ChannelRole) {
        this.id = id;
        this.pseudo = pseudo;
        this.role = (role);
    }
    id: string;
    pseudo: string;
    role: ChannelRole;
}

export class Channel {
    constructor(name: string, password?: string) {
        this.name = name;
        this.private = (password) ? true : false;
        this.password = (password) ? password : null;
        this.users = [];
        this.banneds = [];
        this.messages = [];
    }
    name: string;
    private: boolean = false;
    password: string = null;
    users: User[];
    banneds: string[];
    messages: Message[];
}

@Injectable()
export class ChatService {
    constructor(private userService: UserService,
        @Inject(forwardRef(() => ChatGateway)) private readonly chatGateway: ChatGateway) {
        this.channels = new Map<string, Channel>();
        this.channels.set('General', new Channel('General'));
    }

    private channels: Map<string, Channel>;

    isValidChannelName(name: string): boolean {
        return (name.length >= 3 && name.length <= 25);
    }

    channelExist(name: string): boolean {
        return !!this.channels.get(name);
    }

    insideChannel(userId: string, channelName: string): boolean {
        return !!this.channels.get(channelName).users.find((user) => user.id === userId);
    }

    isBanned(channel: string, userId: string): boolean {
        return !!this.channels.get(channel).banneds.find((user) => user === userId);
    }

    isBlocked(userId: string, targetPseudo: string): boolean {
        // a ecrire
        return false;
    }

    isAdmin(userId: string, channelName: string): boolean {
        const user: User = this.channels.get(channelName).users.find((user) => (user.id) === userId);
        return !(user.role === ChannelRole.USER);
    }

    isPrivateChannel(channelName: string): boolean {
        return this.channels.get(channelName).private;
    }

    channelAccess(userId: string, channelName: string, password?: string) {
        const channel: Channel = this.channels.get(channelName);
        return !(this.isBanned(channelName, userId) || channel.private && channel.password != password);
    }

    banUser(channelName: string, userId: string) {
        this.channels.get(channelName).banneds.push(userId);
    }

    setRole(channelName: string, userId: string, role: ChannelRole) {
        const channel: Channel = this.channels.get(channelName);
        console.log(channel);
        const user: User = channel.users.find((user) => user.id == userId);
        console.log(user, role)
    }

    //TEST
    getChannelDto(channelNames: string[]): ChannelDto[] {
        const channels: ChannelDto[] = channelNames.map((name) => {
            const users: ChannelUserDto[] = this.channels.get(name).users.map((user) => {
                const status: Status = this.chatGateway.getStatus(user.id);
                return {pseudo: user.pseudo, role: user.role, status};
            })
            return {name, users};
        });
        return channels;
    }
    ////////////////////
    
    getChannelNames(): string[] {
        const channels: string[] = [];
        this.channels.forEach((channel) => channels.push(channel.name));
        return channels;
    }

    getChannelNamesByUserId(userId: string): string[] {
        const channelNames: string[] = [];
        this.channels.forEach((channel) => {
            if (channel.users.find((user) => user.id === userId))
                channelNames.push(channel.name);
        })
        return channelNames;
    }

    createChannel(nameChannel: string, password?: string) {
        this.channels.set(nameChannel, new Channel(nameChannel, password));
    }

    async joinChannel(userId: string, role: ChannelRole, channelName: string, password?: string) {
        const channel: Channel = this.channels.get(channelName);
        if (channel.private && channel.password != password)
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.CHANNEL, TypeErr.REJECTED, 'access denied');
        const user: User = new User(userId, await this.userService.getPseudoById(userId), role);
        channel.users.push(user);
        console.log('JOIN', this.channels, channel.users)
    }

    leaveChannel(userId: string, channelName: string) {
        const channel: Channel = this.channels.get(channelName);
        const user: User = channel.users.find((e) => (e.id === userId));
        const index: number = channel.users.indexOf(user);
        channel.users.splice(index, 1);
    }

    messageToUser(userId: string, target: string, text: string) {
        //must create message entitie ??
    }
    
    messageToChannel(userId: string, channelName: string, text: string) {
        //must create message entitie ??
        const channel: Channel = this.channels.get(channelName);
        const author: User = channel.users.find((user) => (user.id) === userId);
        channel.messages.push(new Message(author, text));
    }
}

