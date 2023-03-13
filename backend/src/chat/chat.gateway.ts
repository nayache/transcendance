import { forwardRef, Inject, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Error } from 'src/exceptions/error.interface';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { ChannelRole } from '../enums/channel-role.enum';
import { Status } from '../enums/status.enum';
import { eventMessageDto, joinRoomDto, kickBanDto, leaveRoomDto, muteDto, userDto } from './dto/chat-gateway.dto';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ChannelUserDto } from './chat.controller';
import { Mute } from './entity/mute.entity';

//@UseGuards(JwtGuard)
@WebSocketGateway({ cors: {origin: '*'} })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => AuthService )) private authService: AuthService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly users = new Map<string, Set<Socket>>();
  
  async afterInit() {
    if (!await this.chatService.channelExistt('General')) {
      console.log('BUILD GENERAL')
      await this.chatService.createChannel('General', false);
    }
    this.logger.log('success initialized');
  }

  async authentication(socket: Socket) : Promise<userDto> {
    try {
      const id: string = await this.authService.jwtVerif(socket.handshake.auth.token, true);
      const pseudo: string = await this.userService.getPseudoById(id);
      return {id, pseudo, socket};
    } catch (err) {
      return null;
    }
  }

  async handleConnection(socket: Socket) {
    this.logger.warn(`try to connect: '${socket.id}'`);
    const user: userDto = await this.authentication(socket);
    if (user) {
      if (this.users.has(user.id))
        this.users.get(user.id).add(user.socket);
      else {
        this.users.set(user.id, new Set<Socket>().add(user.socket));
        if (!await this.chatService.insideChannel(user.id, 'General'))
          await this.chatService.joinChannel(user.id, ChannelRole.USER, 'General');
      }
      await this.joinSocketToRooms(user.id, user.socket);
      this.logger.log(`CONNECTED: ${socket.id} (${user.pseudo})`);
      console.log(this.server.of('/').adapter.sids);
      console.log(this.server.of('/').adapter.rooms);
    } else {
      this.logger.error(`reject connection: ${socket.id}`);
      this.disconnect(socket);
    }
  }
  
  getStatus(userId: string): Status {
    if (!this.users.get(userId))
      return Status.OFFLINE;
    return (this.users.get(userId).size) ? Status.ONLINE : Status.OFFLINE;
  }

  async joinSocketToRooms(userId: string, socket: Socket) {
    let channels: string[] = await this.chatService.getChannelNamesByUserId(userId);
    console.log('=> channels rejoined', channels)
    socket.join(channels);
  }

  async joinRoom(userId: string, channel: string) {
    const user: ChannelUserDto = await this.chatService.getChannelUserDto(userId, channel);
    const payload: joinRoomDto = {channel, user};
    if (this.users.get(userId))
      this.users.get(userId).forEach((socket) => socket.join(channel));
    this.server.to(channel).emit('joinRoom', payload);
  }

  async leaveRoom(userId: string, channel: string) {
    const pseudo: string = await this.userService.getPseudoById(userId);
    const payload: leaveRoomDto = {channel, pseudo};
    this.server.to(channel).emit('leaveRoom', payload);
    if (this.users.get(userId))
      this.users.get(userId).forEach((socket) => socket.leave(channel));
  }

  event() {
    this.server.emit('updateRooms');
  }

  channelEvent(channelName: string, info: string) {
    this.server.to(channelName).emit('roomEvent', channelName, info);
  }

  deleteRoomEvent(channel: string) {
    this.server.to(channel).emit('deletedRoom', channel);
    this.server.of('/').adapter.rooms.delete(channel)
  }

  async sendMessageToUser(userId: string, targetId: string, target: string, message: string, date: Date) {
    if (!this.users.get(targetId))
      return
    
    this.users.get(targetId).forEach((socket) => {
      this.server.to(socket.id).emit('message', {target, message, date});
    });
  }

  async sendMessageToChannel(userId: string, channel: string, message: string, color: string) {
    const author: string = await this.userService.getPseudoById(userId);
    const messageData: eventMessageDto = {author, message, channel, color: color};
    this.server.to(channel).emit('messageRoom', messageData);
  }

  friendEvent(eventName: string, targetId: string, pseudo: string) {
    if (!this.users.get(targetId))
      return
    
    this.users.get(targetId).forEach((socket) => {
      this.server.to(socket.id).emit(eventName, pseudo);
    });
  }

  async setAdminEvent(channel: string, authorId: string, targetId: string) {
    const author: ChannelUserDto = await this.chatService.getChannelUserDto(authorId, channel);
    const target: ChannelUserDto = await this.chatService.getChannelUserDto(targetId, channel);
    this.server.to(channel).emit('setAdmin', {channel, author, target});
  }

  channelAccessEvent(channel: string, enabled: boolean, action: string) {
    this.server.to(channel).emit('updateRoomAccess', {channel, action, enabled});
  }

  async punishEvent(channel: string, authorId: string, targetId: string, action: string) {
    const author: ChannelUserDto = await this.chatService.getChannelUserDto(authorId, channel);
    const target: string = await this.userService.getPseudoById(targetId);
    const payload: kickBanDto = { channel, author, target, action };
    if (this.users.get(targetId)) {
      this.users.get(targetId).forEach((socket) => {
        this.server.to(socket.id).emit('punishUser', payload);
        socket.leave(channel);
      });
    }
    this.server.to(payload.channel).emit('punishUser', payload);
  }

  async muteEvent(channel: string, authorId: string, targetId: string, expiration: Date) {
    const author: ChannelUserDto = await this.chatService.getChannelUserDto(authorId, channel);
    const target: ChannelUserDto = await this.chatService.getChannelUserDto(targetId, channel);
    const payload: muteDto = {channel, author, target, expiration};
    this.server.to(channel).emit('muteUser', payload);
  }

  async handleDisconnect(socket: Socket) {
    const user: userDto = await this.authentication(socket);
    //CAS DERREUR POSSIBLE ????
    if (user)
      this.users.get(user.id).delete(user.socket);
    this.logger.log(`DISCONNECTED: ${socket.id}`);
    this.server.emit('DISCONNECTED', socket.id);
    //console.log(this.users)
  }

  //??????
  disconnect(socket: Socket, error: Error = null) {
    socket.emit('error', new Error(AboutErr.TOKEN, TypeErr.REJECTED, 'Reject connection chat socket'));
    socket.disconnect();
  }
}