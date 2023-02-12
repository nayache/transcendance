import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/decorators/user.decorator';
import { Error } from 'src/exceptions/error.interface';
import { UserService } from 'src/user/user.service';
import { Chann, ChatService } from './chat.service';
import { HttpExceptionFilter } from './http-exception.filter';
import { WsExceptionFilter } from './ws-exception.filter';
import { JwtGuard } from './jwt.guard';
import { userDto } from './user.dto';

@UseGuards(JwtGuard)
@UseFilters(HttpExceptionFilter, WsExceptionFilter)
@WebSocketGateway({ cors: {origin: '*'} })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService, private userService: UserService,
    private chatService: ChatService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  
  afterInit() {
    this.logger.log('success initialized');
  }

  async authentication(socket: Socket) : Promise<userDto> {
    try {
      const id: string = await this.authService.jwtVerif(socket.handshake.auth.token);
      const pseudo: string = await this.userService.getPseudoById(id);
      return {id, pseudo};
    } catch (err) {
      return null;
    }
  }

  async handleConnection(socket: Socket) {
    this.logger.warn(`try to connect: '${socket.id}'`);
    const user: userDto = await this.authentication(socket);
    if (user) {
      this.logger.log(`CONNECTED: ${socket.id} (${user.pseudo})`);
      const channels: Chann[] = this.chatService.getChannels();
      if (!this.chatService.insideChannel(channels[0], user.id)) // rejoins chat general seulement a sa first connection
        this.chatService.joinChannel('General', user);
      socket.emit('getRooms', channels);
    } else {
      this.logger.error(`reject connection: ${socket.id}`);
    }
  }
  
  async handleDisconnect(socket: Socket) {
   // const userId = await this.authService.jwtVerif(socket.handshake.auth.token)
   // const pseudo = await this.userService.getPseudoById(userId)
    //console.log(`disconnected: ${socket.id} (${pseudo})`);
    this.logger.log(`DISCONNECTED: ${socket.id}`);
    this.server.emit('DISCONNECTED', socket.id);
  }

  @SubscribeMessage('message')
  async handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket, @User() user: userDto) {
   // await this.authService.jwtVerif('bolognaise')
      //this.disconnect(socket, `(${socket.id}) is unauthorized in handleEvent()`);
    this.logger.log(`message event: ${user.pseudo}`);
    this.server.emit('message', user.pseudo, data);
  }
  
  @SubscribeMessage('getRooms')
  getRooms(@ConnectedSocket() socket: Socket) {
    const channels: Chann[] = this.chatService.getChannels();
    socket.emit('getRooms', channels);
  }
  
  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() name: string, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    console.log(name, user);
    this.chatService.createChann(name, user);
    this.logger.log(`[${name}] channel has been created by ${user.pseudo}`);
    socket.emit('createRoom', user.pseudo, name);
  }
  
  @SubscribeMessage('leaveRoom')
  async leaveRoom(@MessageBody() name: string, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    this.chatService.leaveChannel(name, user);
    this.logger.log(`${user.pseudo} has leaved [${name}] channel`);
    socket.emit('leaveRoom', user.pseudo, name);
  }
  
  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() name: string, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    this.chatService.joinChannel(name, user);
    this.logger.log(`(${user.pseudo}) has joined [${name}] channel`);
    socket.emit('joinRoom', user.pseudo, name);
  }

  disconnect(socket: Socket, error: Error = null) {
    socket.emit('error', error);
    socket.disconnect()
  }
}
