import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from './jwt.guard';

//@UseGuards(JwtGuard)
@WebSocketGateway({ cors: {origin: '*'} })
export class ChatGateway {
  constructor(private authService: AuthService, private userService: UserService) {}

  @WebSocketServer() server: Server;
   
  async handleConnection(socket: Socket) {
    try {
      const userId = await this.authService.jwtVerif(socket.handshake.auth.token)
      const pseudo = await this.userService.getPseudoById(userId)
      console.log(`connected: ${socket.id} (${pseudo})`);
      this.server.emit('connected', pseudo);
    } catch {
      console.log(`error: rejected connection for ${socket.id}`);
      this.disconnect(socket, 'unauthorized');
    }
  }
  
  handleDisconnect(socket: Socket) {
    console.log(`disconnected: ${socket.id}`);
    this.server.emit('disconnected', socket.id);
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('message')
  async handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket, @User() userId: string) {
    if (!userId)
      this.disconnect(socket, `(${await this.userService.getPseudoById(userId)}) is unauthorized in handleEvent()`);
    this.server.emit('message', socket.id, data);
  }

  private disconnect(socket: Socket, message: string) {
    socket.emit('error', message);
    socket.disconnect()
  }
}
