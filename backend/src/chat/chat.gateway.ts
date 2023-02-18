import { forwardRef, Inject, Injectable, Logger, UseFilters, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Error } from 'src/exceptions/error.interface';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from './guards/jwt.guard';
import { ChatService } from './chat.service';
import { ChannelRole } from './enums/channel-role.enum';
import { Status } from './enums/status.enum';

class userDto {
  id: string;
  pseudo: string;
  socket: Socket;
}

//@UseGuards(JwtGuard)
@WebSocketGateway({ cors: {origin: '*'} })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService, private userService: UserService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly users = new Map<string, Set<Socket>>();
  
  afterInit() {
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
        await this.chatService.joinChannel(user.id, ChannelRole.USER, 'General');
      }
      this.joinSocketToRooms(user.id, user.socket);
      this.logger.log(`CONNECTED: ${socket.id} (${user.pseudo})`);
      console.log(this.server.of('/').adapter.sids);
    } else {
      this.logger.error(`reject connection: ${socket.id}`);
      this.disconnect(socket);
    }
  }
  
  getStatus(userId: string): Status {
    return (this.users.get(userId).size) ? Status.ONLINE : Status.OFFLINE;
  }

  joinSocketToRooms(userId: string, socket: Socket) {
    const channels: string[] = this.chatService.getChannelNamesByUserId(userId);
    socket.join(channels);
  }

  async joinRoom(userId: string, channelName: string) {
    const pseudo: string = await this.userService.getPseudoById(userId);
    this.users.get(userId).forEach((socket) => socket.join(channelName));
    this.server.to(channelName).emit('joinRoom', `${pseudo} has joined [${channelName}] channel`);
    //const channels
  }

  async leaveRoom(userId: string, channelName: string) {
    const pseudo: string = await this.userService.getPseudoById(userId);
    this.users.get(userId).forEach((socket) => socket.leave(channelName));
    this.server.to(channelName).emit('leaveRoom', `${pseudo} has leaved [${channelName}] channel`);
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

  async sendMessageToChannel(userId: string, channel: string, message: string) {
    const pseudo: string = await this.userService.getPseudoById(userId);
    this.server.to(channel).emit('message', pseudo, message);
  }

  async handleDisconnect(socket: Socket) {
    const user: userDto = await this.authentication(socket);
    //CAS DERREUR POSSIBLE ????
    if (user)
      this.users.get(user.id).delete(user.socket);
    this.logger.log(`DISCONNECTED: ${socket.id}`);
    this.server.emit('DISCONNECTED', socket.id);
    console.log(this.users)
  }

  //??????
  disconnect(socket: Socket, error: Error = null) {
    socket.emit('error', error);
    socket.disconnect();
  }
}
