import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entity/channel.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { WsChatError } from 'src/exceptions/ws-chat-error.exception';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { userDto } from './user.dto';

export class UserPayload {
    constructor(pseudo: string, socketId: string) {
        this.pseudo = pseudo;
        this.socketId = new Set<string>().add(socketId);
    }
    pseudo: string;
    socketId: Set<string>;
}

export class Chann {
    constructor(name: string, owner: string, password?: string) {
        this.name = name;
        this.owner = owner;
        if (password) {
            this.private = true;
            this.password = password;
        }
        this.admins = [];
        this.users = [];
        this.banned = [];
    }
    name: string;
    private: boolean = false;
    password: string = null;
    owner: string;
    admins: string[];
    users: string[];
    banned: string[];
}

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private readonly userService: UserService) {
        this.users = new Map<string, UserPayload>();
        this.channels = new Map<string, Chann>();
        this.channels.set('General', new Chann('General', null));
        this.channels.set('Help', new Chann('Help', null));
    }
    private channels: Map<string, Chann>; //name, channelObject
    private users: Map<string, UserPayload> // userID, (pseudo, sockets)

    isValidName(name: string): boolean {
        if (name.length >= 3 && name.length <= 20)
            return true;
        return false;
    }
    /*
    ============WITH ENTITY=================
    */
    async channelExist(name: string): Promise<boolean> {
        return this.channelRepository.exist({where: {name: name}});
    }

    async createChannel(name: string, owner: UserEntity, password: string): Promise<Channel> {
        return this.channelRepository.save(new Channel(name, owner, password));
    }
    /*
    =======================================
    */

    //start ICIIII
    addUser(user: userDto) {
        if (this.users.has(user.id))
            this.users.get(user.id).socketId.add(user.socket.id)
        else
            this.users.set(user.id, new UserPayload(user.pseudo, user.socket.id));
        
        console.log(this.users);
    }

    removeSocket(user: userDto) {
        this.users.get(user.id).socketId.delete(user.socket.id);
        console.log(`RMM SOCKET(${user.socket.id})=>`, this.users);
    }

    getChannels(): Chann[] {
        return Array.from(this.channels.values());
    }

    channExist(name: string): boolean {
        if (!this.channels.get(name))
            return false;
        return true;
    }

    userExist(pseudo: string): boolean {
        for (const user of this.users.values()) {
            if (user.pseudo === pseudo)
                return true
        }
        return false;
    }

    getUserId(pseudo: string): string {
        for (const [key, value] of this.users.entries()) {
            if (value.pseudo === pseudo)
                return key;
        }
        console.log('Fail not found pseudo in a getUserId()');
        return null;
    }

    insideChannel(channel: Chann, userId: string): boolean {
        return !!channel.users.find((user) => (user) === userId);
    }

    isChannelAdmin(channelName: string, userId: string): boolean {
        const res = !!this.channels.get(channelName).admins.find((user) => (user) === userId);
        console.log('resssss:', res)
        return res
    }

    channelAccess(channel: Chann, password: string): boolean {
        console.log(channel.password,password);
        if (channel.private && channel.password !== password)
            return false;
        return true;
    }

    setChannelAccess(channel: Chann, password?: string) {
        channel.private = !!password;
        channel.password = (password) ? password : null;
    }

    modifyAccessChannel(user: userDto, name: string, newPass?: string, password?: string) {
        if (!this.channExist(name))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.DUPLICATED, `[${name}] channel not exist`);
        const channel: Chann = this.channels.get(name);
        if (!this.channelAccess(channel, password)) {
            const msg: string = (`'modifyChannel: (${user.pseudo}) access denied in private [${name}] channel`);
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.REJECTED, msg);
        }
        this.setChannelAccess(channel, newPass);
        console.log(channel);
    }

    createChann(owner: userDto, name: string, password?: string) {
        if (password)
            console.log('pass arg?: ', password)
        console.log('pass val: ', password, name)
        //only general chat can not have owner
        if (!this.isValidName(name))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, `'${name}' is invalid channel name`);
        if (this.channExist(name))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.DUPLICATED, `[${name}] channel already exist`);
        const newChann: Chann = new Chann(name, owner.id, password);
        newChann.admins.push(owner.id);
        newChann.users.push(owner.id);
        this.channels.set(name, newChann);
        console.log('new channel: ', newChann)
        owner.socket.join(name);     
    }

    joinChannel(user: userDto, channelName: string, password?: string) {
        const channel: Chann = this.channels.get(channelName);
        if (!channel) {
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, `'joinChannel: '${channelName}' channel not exist`);
        }
        if (this.insideChannel(channel, user.id)) {
            const msg: string = `'joinChannel: (${user.pseudo}) already in [${channelName}] channel`;
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, msg);
        }
        if (!this.channelAccess(channel, password)) {
            const msg: string = (`'joinChannel: (${user.pseudo}) access denied in private [${channelName}] channel`);
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.REJECTED, msg);
        }
        channel.users.push(user.id);
        user.socket.join(channelName);     
    }

    removeUserFromChannel(channel: Chann, user: string) {
        // A voir plus tard: si owner leave ===> destruction channel??
        let index: number = channel.admins.indexOf(user);
        if (index != -1)
            channel.admins.splice(index, 1);
        index = channel.users.indexOf(user);
        channel.users.splice(index, 1);
    }

    leaveChannel(channelName: string, user: userDto) {
        const channel: Chann = this.channels.get(channelName);
        if (!channel || !this.insideChannel(channel, user.id))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, `leaveChannel: ${user.pseudo} is not in [${channelName}] channel`);
        this.removeUserFromChannel(channel, user.id);
        user.socket.leave(channelName);     
    }

    messageToChannel(channel: Chann, message: string, author: userDto) {
        if (!this.insideChannel(channel, author.id))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, `(${author.pseudo}) is not in [${channel.name}] channel`);
        author.socket.to(channel.name).emit('message', author.pseudo, message);
    }

    sendRoomMessage(target: string, message: string, author: userDto) {
        if (!target)
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.EMPTY, `empty target message`);
        if (!this.channExist(target))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.NOT_FOUND, `channel target not found`);
        const channel: Chann = this.channels.get(target);
        this.messageToChannel(channel, message, author);
    }

    messageToUser(author: userDto, target: string, message: string) {
        //if blocked error
        const targetId: string = this.getUserId(target); 
        author.socket.emit('message', author.pseudo, message); // accuse reception pour voir message dans conv auteur
        this.users.get(targetId).socketId.forEach((sid) => {
            author.socket.to(sid).emit('message', author.pseudo, message);
        })
    }

    sendMessage(target: string, message: string, author: userDto) {
        if (!target)
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.EMPTY, `empty target message`);
        if (!this.userExist(target))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.NOT_FOUND, `user target not found`);
        this.messageToUser(author, target, message);
    }
}
