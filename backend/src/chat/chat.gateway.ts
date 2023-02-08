import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/decorators/user.decorator';
import { Error } from 'src/exceptions/error.interface';
import { UserService } from 'src/user/user.service';
import { WsExceptionFilter } from './exception.filter';

//@UseGuards(JwtGuard)
@UseFilters(WsExceptionFilter)
@WebSocketGateway({ cors: {origin: '*'} })
export class ChatGateway {
  constructor(private authService: AuthService, private userService: UserService) {}

  @WebSocketServer() server: Server;
  
  async authentication(socket: Socket) : Promise<string|Error> {
    try {
      const userId = await this.authService.jwtVerif(socket.handshake.auth.token);
      return await this.userService.getPseudoById(userId);
    } catch (err) {
        return null;
    }
  }

  async handleConnection(socket: Socket) {
    console.log(`try connect: ${socket.id}`);
    const pseudo = await this.authentication(socket);
    if (pseudo)
      console.log(`connected: ${socket.id} (${pseudo})`);
  }
  
  async handleDisconnect(socket: Socket) {
   // const userId = await this.authService.jwtVerif(socket.handshake.auth.token)
   // const pseudo = await this.userService.getPseudoById(userId)
    //console.log(`disconnected: ${socket.id} (${pseudo})`);
    console.log(`disconnected: ${socket.id}`);
    this.server.emit('disconnected', socket.id);
  }

 // @UseGuards(JwtGuard)
  @SubscribeMessage('message')
  async handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket, @User() userId: string) {
   // await this.authService.jwtVerif('bolognaise')
      //this.disconnect(socket, `(${socket.id}) is unauthorized in handleEvent()`);
    this.server.emit('message', await this.userService.getPseudoById(userId), data);
  }

  disconnect(socket: Socket, error: Error) {
    socket.emit('error', error);
    socket.disconnect()
  }
}
