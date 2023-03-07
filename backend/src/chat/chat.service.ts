import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from '../enums/channel-role.enum';
import { ChannelDto, ChannelMessageDto, channelPreviewDto, ChannelUserDto, prvMsgDto } from './chat.controller';
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

@Injectable()
export class ChatService {
    constructor(
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
        @InjectRepository(Member) private memberRepository: Repository<Member>,
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
        @InjectRepository(PrivateMessageEntity) private privateMsgRepository: Repository<PrivateMessageEntity>,
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
        if (password.length < 5 || password.length > 15)
            return false;
        if (password.search(/\s/) != -1)
            return false;
        let alphaCount: number = 0;
        for (var i = 0; i < password.length; i++) {
            if (isAlpha(password[i]))
                alphaCount++;
        }
        return (alphaCount >= 6);
    }

    async channelAccess(userId: string, channelName: string, password?: string): Promise<boolean> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        if (channel.private === true)
            return false;
        if (await this.isBanned(channelName, userId))
            return false;
        return !(channel.private && channel.password != password);
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
            return {name: channel.name, users, messages};
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

    async leaveChannel(userId: string, channelName: string) {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        await this.memberRepository.delete({id: member.id});
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
    
    async getConversation(user1Id: string, user2Id: string): Promise<prvMsgDto[]> {
        const messages: PrivateMessageEntity[] = await this.getPrivateMessages(user1Id, user2Id);
        const user1: string = await this.userService.getPseudoById(user1Id);
        const user2: string = await this.userService.getPseudoById(user2Id);
        const conversation: prvMsgDto[] = messages.map((message) => {
            const author: string = (message.authorId === user1Id) ? user1 : user2;
            return { author, content: message.content, date: message.created_at };
        });
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
