import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entity/channel.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { WsChatError } from 'src/exceptions/ws-chat-error.exception';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { userDto } from './user.dto';

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
    }
    name: string;
    private: boolean = false;
    password: string = null;
    owner: string;
    admins: string[];
    users: string[]; 
}

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private readonly userService: UserService) {
        this.channels = new Map<string, Chann>();
        this.channels.set('General', new Chann('General', null));
        this.channels.set('Help', new Chann('Help', null));
    }
    private channels: Map<string, Chann>;

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
    getChannels(): Chann[] {
        return Array.from(this.channels.values());
    }

    channExist(name: string) {
        if (!this.channels.get(name))
            return false;
        return true;
    }

    insideChannel(channel: Chann, userId: string): boolean {
        return !!channel.users.find((user) => (user) === userId);
    }

    channelAccess(channel: Chann, password: string): boolean {
        if (channel.private && channel.password != password)
            return false;
        return true;
    }

    createChann(name: string, owner: userDto, password?: string) {
        //only general chat can not have owner
        if (!this.isValidName(name))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.INVALID, `'${name}' is invalid channel name`);
        if (this.channExist(name))
            throw new WsChatError(AboutErr.CHANNEL, TypeErr.DUPLICATED, `[${name}] channel already exist`);
        
        const newChann: Chann = new Chann(name, owner.id, password);
        newChann.admins.push(owner.id);
        newChann.users.push(owner.id);
        this.channels.set(name, newChann);
    }

    joinChannel(channelName: string, user: userDto, password?: string) {
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
    }
}
