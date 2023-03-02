import { forwardRef, Inject, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Error } from 'src/exceptions/error.interface';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { ChannelRole } from './enums/channel-role.enum';
import { Status } from './enums/status.enum';
import { eventMessageDto, joinRoomDto, leaveRoomDto, userDto } from './dto/chat-gateway.dto';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ChannelUserDto } from './chat.controller';

//@UseGuards(JwtGuard)
@WebSocketGateway({ cors: {origin: '*'} })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService, private userService: UserService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly users = new Map<string, Set<Socket>>();
  
  async afterInit() {
    if (!await this.chatService.channelExistt('General')) {
      console.log('BUILD GENERAL')
      await this.chatService.createChannel('General');
    }
    this.logger.log('success initialized');
  }

  async authentication(socket: Socket) : Promise<userDto> {
    try {
      const id: string = await this.authService.jwtVerif(socket.handshake.auth.token);
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

  async sendMessageToUser(userId: string, targetId: string, message: string) {
    const pseudo: string = await this.userService.getPseudoById(userId);
    this.users.get(targetId).forEach((socket) => {
      this.server.to(socket.id).emit('message', pseudo, message);
    });
  }

  async sendMessageToChannel(userId: string, channel: string, message: string, color: string) {
    const author: string = await this.userService.getPseudoById(userId);
    const messageData: eventMessageDto = {author, message, channel, color: color};
    this.server.to(channel).emit('messageRoom', messageData);
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