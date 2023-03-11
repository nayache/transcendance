import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from '../enums/channel-role.enum';
import { ChannelDto, ChannelMessageDto, channelPreviewDto, ChannelUserDto, Discussion, prvMsgDto } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Status } from '../enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from './entity/channel.entity';
import { Repository } from 'typeorm';
import { Member } from './entity/member.entity';
import { MessageEntity } from './entity/message.entity';
import { PrivateMessageEntity } from './entity/privateMessage.entity';
import { UserEntity } from 'src/entity/user.entity';
import { isAlpha } from 'class-validator';
import { Mute } from './entity/mute.entity';
import { Error } from 'src/exceptions/error.interface';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { Avatar } from 'src/entity/avatar.entity';


@Injectable()
export class ChatService {
    constructor(
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
        @InjectRepository(Member) private memberRepository: Repository<Member>,
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
        @InjectRepository(PrivateMessageEntity) private privateMsgRepository: Repository<PrivateMessageEntity>,
        @InjectRepository(Mute) private muteRepository: Repository<Mute>,
        @Inject(forwardRef(() => ChatGateway))private readonly chatGateway: ChatGateway) {
    }

    private color: string[] = ["blue", "red", "brown", "black", "blueviolet",
     "DarkGoldenRod", "Crimson", "DarkBlue", "DarkCyan", "DarkGreen", "DarkSeaGreen", "Green"];

    generateColorr(channel: ChannelEntity): string {
        return this.color[(channel.visited - 1) % this.color.length];
    }

    isValidChannelName(name: string): boolean {
        console.log('name: ',name)
        if (name.search(/\s/) != -1)
            return false
        return (name.length >= 3 && name.length <= 20);
    }

    async channelExistt(name: string): Promise<boolean> {
        return this.channelRepository.exist({where: {name: name}});
    }

    async getChannelByName(channelName: string): Promise<ChannelEntity> {
        return this.channelRepository.findOne({where: { name: channelName},
             relations: { messages: true, members: true }
            });
         //return this.channelRepository.findOneBy({name: channelName});
    }

    async insideChannel(userId: string, channelName: string): Promise<boolean> {
        const channelId: string = (await this.getChannelByName(channelName)).id; 
        return this.memberRepository.exist({where: {
            userId: userId, channelId: channelId
        }});
    }

    async isBanned(channelName: string, userId: string): Promise<boolean> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        return !!channel.banneds.find((user) => user === userId);
    }

    isBlocked(userId: string, targetPseudo: string): boolean {
        // a ecrire
        return false;
    }

    async isAdmin(userId: string, channelName: string): Promise<boolean> {
        return this.memberRepository.exist({ relations: ['channel'],
            where: [
                { channel: { name: channelName }, userId: userId, role: ChannelRole.ADMIN },
                { channel: { name: channelName }, userId: userId, role: ChannelRole.OWNER },
        ]});
    }
    async isOwner(userId: string, channelName: string): Promise<boolean> {
        return this.memberRepository.exist({ relations: ['channel'],
            where: { channel: { name: channelName },
                userId: userId, role: ChannelRole.OWNER,
            }
        });
    }

    async isPrivateChannel(channelName: string): Promise<boolean> {
        return (await this.getChannelByName(channelName)).private;
    }

    isValidChannelPassword(password: string): boolean {
        if (password.search(/\s/) != -1)
            return false;
        if (password.length < 6 || password.length > 15)
            return false;
        let alphaCount: number = 0;
        for (var i = 0; i < password.length; i++) {
            if (isAlpha(password[i]))
                alphaCount++;
        }
        return (alphaCount >= 6);
    }

    async channelAccess(userId: string, channelName: string, password?: string): Promise<Error> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        if (channel.private === true)
            return new Error(AboutErr.CHANNEL, TypeErr.REJECTED, 'channel is private');
        if (await this.isBanned(channelName, userId))
            return new Error(AboutErr.USER, TypeErr.REJECTED, 'user is banned');
        if (channel.password && channel.password != password)
            return new Error(AboutErr.PASSWORD, TypeErr.INVALID, 'channel password is incorrect');
        return null;
    }

    async setChannelAccess(channelName: string, prv: boolean) {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        await this.channelRepository.update(channel.id, {private: prv});
    }

    async setChannelPassword(channelName: string, password: string) {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        await this.channelRepository.update(channel.id, {password: password});
    }

    async banUser(channelName: string, userId: string) {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        channel.banneds.push(userId);
        await this.channelRepository.update(channel.id, {banneds: channel.banneds});
    }

    getMuteExpiration(muted: Mute): Date {
        return new Date(muted.updated_at.getTime() + (muted.duration * 1000));
    }

    async isMuted(channelName: string, userId: string): Promise<boolean> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const muted: Mute = await this.findMute(channel, userId);
        if (muted) {
            if (Date.now() >= (muted.updated_at.getTime() + (muted.duration * 1000)))
                await this.muteRepository.delete(muted.id);
            else
                return true;
        }
        return false;
    }

    async findMute(channel: ChannelEntity, userId: string): Promise<Mute> {
        return this.muteRepository.findOne({where: {
            channelId: channel.id, userId: userId
        }});
    }

    async muteUser(channelName: string, userId: string, duration: number): Promise<Mute> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const user: UserEntity = await this.userService.findById(userId);
        console.log(await this.isMuted(channelName, userId))
        let muted: Mute = await this.findMute(channel, userId);
        if (!muted)
            return this.muteRepository.save(new Mute(channel, user, duration));
        await this.muteRepository.update(muted.id, { duration: duration } );
        return this.findMute(channel, userId);
    }

    async setRole(channelName: string, userId: string, role: ChannelRole) {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        await this.memberRepository.update(member.id, {role: role});
    }

    async getMemberColor(channelName: string, userId: string): Promise<string> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        return member.color;
    }

    async getMembersByChannel(channelId: string): Promise<Member[]> {
        return this.memberRepository.find({relations: ['channel'],
            where: { channelId: channelId }
        });
    }

    async getMessagesByChannel(channelId: string): Promise<MessageEntity[]> {
        return this.messageRepository.find({relations: ['channel'],
            where: { channelId: channelId }    
        })
    }

    messageToDto(msg: MessageEntity): ChannelMessageDto {
        const {id, channel, channelId, ...message} = msg;
        return message;
    }

    async getChannelUserDto(userId: string, channelName: string): Promise<ChannelUserDto> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        const pseudo: string = await this.userService.getPseudoById(member.userId);
        const status: Status = this.chatGateway.getStatus(userId);
        const user: ChannelUserDto = {pseudo: pseudo, color: member.color, role: member.role, status};
        return user;
    }

    async getChannelDto(channels: ChannelEntity[]): Promise<ChannelDto[]> {
        const channs: ChannelDto[] = await Promise.all(channels.map(async (channel) => {
            const members: Member[] = await this.getMembersByChannel(channel.id);
            const messagesChannel: MessageEntity[] = await this.getMessagesByChannel(channel.id);
            const messages: ChannelMessageDto[] = messagesChannel.map((msg) => this.messageToDto(msg));
            const users: ChannelUserDto[] = members.map((member) => {
                const status: Status = this.chatGateway.getStatus(member.userId);
                return {pseudo: member.user.pseudo, color: member.color, role: member.role, status};
            })
            return {name: channel.name, prv: channel.private, password: !!channel.password, users, messages};
        }));
        return channs;
    }

    getChannelPreviewDto(channels: ChannelEntity[]): channelPreviewDto[] {
        const channs: channelPreviewDto[] = channels.map((channel) => {
            return { name: channel.name, password: !!channel.password, prv: channel.private };
        })
        return channs;
    }

    async getChannelsByUserId(userId: string): Promise<ChannelEntity[]> {
        return await this.channelRepository.find({ relations:
                ['members'],
            where: {
                members: { userId: userId },
            }
        });
    }

    async getChannels(): Promise<ChannelEntity[]>{
        return this.channelRepository.find();        
    }
    
    async getChannelNames(): Promise<string[]> {
        const channels: ChannelEntity[] = await this.getChannels();
        const channelsNames: string[] = channels.map((channel) => channel.name);
        return channelsNames;
    }

    async getChannelNamesByUserId(userId: string): Promise<string[]> {
        const channels: ChannelEntity[] = await this.getChannelsByUserId(userId);
        return channels.map((channel) => channel.name);
    }

    async createChannel(nameChannel: string, prv: boolean, password?: string) {
        await this.channelRepository.save(new ChannelEntity(nameChannel, prv, password));
    }

    async deleteChannel(channel: ChannelEntity) {
        await this.channelRepository.delete(channel.id);
    }

    async joinChannel(userId: string, role: ChannelRole, channelName: string): Promise<ChannelEntity> {
        const chann: ChannelEntity = await this.channelRepository.findOneBy({name: channelName});
        chann.visited += 1;
        const colorr: string = this.generateColorr(chann);
        const member = new Member(await this.userService.findById(userId), chann, colorr, role);
        if (!chann.members)
            chann.members = [member];
        else
            chann.members = [...chann.members, ...[member]];
        return this.channelRepository.save(chann);
    }   

    async getMemberByUserId(userId: string, channelId: string): Promise<Member> {
        return this.memberRepository.findOne({ where: {
            userId: userId,
            channelId: channelId
        }});
    }

    async leaveChannel(userId: string, channelName: string): Promise<boolean> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        const isOwner: boolean = (member.role === ChannelRole.OWNER);
        if (member.role === ChannelRole.OWNER)
            await this.channelRepository.delete(channel.id);
        else
            await this.memberRepository.delete({id: member.id});
        return isOwner;
    }


    async getPrivateMessages(user1: string, user2: string): Promise<PrivateMessageEntity[]> {
        const messages: PrivateMessageEntity[] = await this.privateMsgRepository.find({
            where: [
                {authorId: user1, targetId: user2},
                {authorId: user2, targetId: user1} 
            ]
        })
        return messages;
        //penser a check si throw 500
    }
    
    async findPrivateMsg(userId: string): Promise<PrivateMessageEntity[]> {
        try {
            return await this.privateMsgRepository.find({where: [
                {authorId: userId},
                {targetId: userId}
            ]});
        } catch (e) {
            return null;
        }
    }

    async getUnreadMessages(authorId: string, targetId: string): Promise<PrivateMessageEntity[]> {
        try {
            return await this.privateMsgRepository.find({where:
                {authorId: authorId, targetId: targetId, read: false},
            });
        } catch (e) {
            return null;
        }
        
    }

    async getDiscussions(userId: string): Promise<Discussion[]> {
        const messages: PrivateMessageEntity[] = await this.findPrivateMsg(userId);
        console.log(messages);
        let users: string[] = [];
        messages.map((msg) => {
            if (!users.find((name) => (name) === msg.authorId || (name) === msg.targetId))
                users.push((msg.authorId === userId) ? msg.targetId : msg.authorId);
        });
        const discussions: Discussion[] = await Promise.all(users.map(async (user) => {
            const pseudo: string = await this.userService.getPseudoById(user);
            //const avatar: Avatar = await this.userService.getAvatar(user.id);
            const avatar = null; //============================================================> SAMIIIIII pour toi
            const unreadMessages: PrivateMessageEntity[] = await this.getUnreadMessages(user, userId);
            return { pseudo, avatar, unread: (unreadMessages) ? unreadMessages.length : 0 };
        }))
        return discussions;
    }

    async getConversation(user1Id: string, user2Id: string): Promise<prvMsgDto[]> {
        const messages: PrivateMessageEntity[] = await this.getPrivateMessages(user1Id, user2Id);
        const user1: string = await this.userService.getPseudoById(user1Id);
        const user2: string = await this.userService.getPseudoById(user2Id);
        const conversation: prvMsgDto[] = await Promise.all(messages.map(async (message) => {
            if (message.authorId === user2Id && message.read === false)
                await this.privateMsgRepository.update(message.id, {read: true});
            const author: string = (message.authorId === user1Id) ? user1 : user2;
            return { author, content: message.content, date: message.created_at };
        }));
        return conversation;
    }

    async messageToUser(userId: string, targetId: string, content: string) {
        const author: UserEntity = await this.userService.findById(userId);
        const target: UserEntity = await this.userService.findById(targetId);
        const message: PrivateMessageEntity = new PrivateMessageEntity(author, target, content);
        await this.privateMsgRepository.save(message);
    }
    
    async messageToChannel(userId: string, channelName: string, text: string): Promise<string> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        const pseudo: string = await this.userService.getPseudoById(member.userId);
        await this.messageRepository.save(new MessageEntity(channel, pseudo, member.color, text));
        return member.color;
    }
}
