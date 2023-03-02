import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ChannelRole } from './enums/channel-role.enum';
import { ChannelDto, ChannelMessageDto, ChannelUserDto } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Status } from './enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from './entity/channel.entity';
import { Repository } from 'typeorm';
import { Member } from './entity/member.entity';
import { MessageEntity } from './entity/message.entity';

@Injectable()
export class ChatService {
    constructor(private userService: UserService,
        @InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
        @InjectRepository(Member) private memberRepository: Repository<Member>,
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
        @Inject(forwardRef(() => ChatGateway)) private readonly chatGateway: ChatGateway) {
    }

    private color: string[] = ["brown", "red", "blue", "black", "blueviolet",
     "DarkGoldenRod", "Crimson", "DarkBlue", "DarkCyan", "DarkGreen", "DarkSeaGreen", "Green"];

    generateColorr(channel: ChannelEntity): string {
        return this.color[channel.visited - 1 % this.color.length];
    }

    isValidChannelName(name: string): boolean {
        console.log('name: ',name)
        if (name.search(/\s/) != -1)
            return false
        return (name.length >= 3 && name.length <= 25);
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
            where: { channel: { name: channelName },
                userId: userId, role: ChannelRole.ADMIN,
            }
        });
    }

    async isPrivateChannel(channelName: string): Promise<boolean> {
        return (await this.getChannelByName(channelName)).private;
    }

    async channelAccess(userId: string, channelName: string, password?: string): Promise<boolean> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
       // return !(this.isBanned(channelName, userId) || channel.private && channel.password != password);
       return !(channel.private && channel.password != password);
    }

    async banUser(channelName: string, userId: string) {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        channel.banneds.push(userId);
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
        const member: Member = await this.getMemberByUserId(userId, channel.id)
        const status: Status = this.chatGateway.getStatus(userId);
        const user: ChannelUserDto = {pseudo: member.user.pseudo, color: member.color, role: member.role, status};
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
        }))
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
    
    async getChannelNamesByUserId(userId: string): Promise<string[]> {
        const channels: ChannelEntity[] = await this.getChannelsByUserId(userId);
        return channels.map((channel) => channel.name);
    }

    async createChannel(nameChannel: string, password?: string) {
        await this.channelRepository.save(new ChannelEntity(nameChannel, password));
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

    messageToUser(userId: string, target: string, text: string) {
        //must create message entitie ??
    }
    
    async messageToChannel(userId: string, channelName: string, text: string): Promise<string> {
        const channel: ChannelEntity = await this.getChannelByName(channelName);
        const member: Member = await this.getMemberByUserId(userId, channel.id);
        const pseudo: string = await this.userService.getPseudoById(member.userId);
        await this.messageRepository.save(new MessageEntity(channel, pseudo, member.color, text));
        return member.color;
    }
}

