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
import { RoleGuard } from './role.guard';

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
      return {id, pseudo, socket};
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
        this.chatService.joinChannel(user, 'General');
      if (!this.chatService.insideChannel(channels[1], user.id)) // rejoins chat general seulement a sa first connection
        this.chatService.joinChannel(user, 'Help');
      
      socket.join(['General', 'Help']);
      socket.emit('getRooms', channels);
      //console.log(this.server.of('/').adapter.sids)
      this.chatService.addUser(user); //ajoute socket au serveur
    } else {
      this.logger.error(`reject connection: ${socket.id}`);
    }
  }
  
  async handleDisconnect(socket: Socket) {
    const user: userDto = await this.authentication(socket);
    //CAS DERREUR POSSIBLE ????
    if (user)
      this.chatService.removeSocket(user);
    this.logger.log(`DISCONNECTED: ${socket.id}`);
    this.server.emit('DISCONNECTED', socket.id);
  }

  @SubscribeMessage('message')
  sendMessage(@MessageBody() data: {target: string, msg: string}, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    user.socket = socket;
    this.chatService.sendMessage(data.target, data.msg, user);
    this.logger.log(`message event: ${user.pseudo}`);
  }
  
  @SubscribeMessage('messageRoom')
  async sendRoomMessage(@MessageBody() data: {target: string, msg: string}, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    user.socket = socket;
    this.chatService.sendRoomMessage(data.target, data.msg, user);
    this.logger.log(`messageRoom event: ${user.pseudo}`);
  }
  
  @SubscribeMessage('getRooms')
  getRooms() {
    const channels: Chann[] = this.chatService.getChannels();
    this.server.emit('getRooms', channels);
  }
  
  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() data: {name: string, pass?: string}, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    user.socket = socket;
    this.chatService.createChann(user, data.name, data.pass);
    this.logger.log(`[${data.name}] channel has been created by ${user.pseudo}`);
    socket.emit('createRoom', user.pseudo, data.name);
  }
  
  //@UseGuards(RoleGuard)
  @SubscribeMessage('leaveRoom')
  async leaveRoom(@MessageBody() name: string, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    user.socket = socket;
    this.chatService.leaveChannel(name, user);
    this.logger.log(`${user.pseudo} has leaved [${name}] channel`);
    socket.emit('leaveRoom', user.pseudo, name);
  }
  
  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data:{name: string, pass?: string}, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    user.socket = socket;
    this.chatService.joinChannel(user, data.name, data.pass);
    this.logger.log(`(${user.pseudo}) has joined [${data.name}] channel`);
    socket.emit('joinRoom', user.pseudo, data.name);
  }

  @UseGuards(RoleGuard)
  @SubscribeMessage('setRoomPassword')
  modifyAccessRoom(@MessageBody() data: {name: string, newPass?: string, pass?: string}, @ConnectedSocket() socket: Socket, @User() user: userDto) {
    user.socket = socket;
    this.chatService.modifyAccessChannel(user, data.name, data.newPass, data.pass);
    socket.emit('setRoomPassword', user.pseudo, data.name);
  }


  disconnect(socket: Socket, error: Error = null) {
    socket.emit('error', error);
    socket.disconnect()
  }
}
