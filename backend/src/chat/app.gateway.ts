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
import { GameService } from 'src/game/game.service';
import { Difficulty } from 'src/game/game.controller';
import { GameEntity } from 'src/game/game.entity';


export class GameDto {
  id: string;
  ranked: boolean;
  difficulty: Difficulty;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  forfeit: boolean;
  xp1: number;
  xp2: number;
  date: Date;
}
//@UseGuards(JwtGuard)
@WebSocketGateway({ cors: {origin: '*'} })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => AuthService )) private authService: AuthService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
    @Inject(forwardRef(() => GameService)) private gameService: GameService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger();
  private readonly users = new Map<string, Set<Socket>>();
  private readonly inGamePage = new Map<string, Socket>();
  private readonly ready = new Set<string>();
  
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
    this.logger.warn(`try to connect: '${socket.id}'`, "Gateway");
    const user: userDto = await this.authentication(socket);
    if (!user)
      return this.disconnect(socket);
    if (socket.handshake.query.page === "game") {
      if (this.inGamePage.has(user.id))
        return this.alreadyInGame(socket);
      else
        this.inGamePage.set(user.id, user.socket);
    }
    if (this.users.has(user.id))
      this.users.get(user.id).add(user.socket);
    else {
      this.users.set(user.id, new Set<Socket>().add(user.socket));
    }
    await this.joinSocketToRooms(user.id, user.socket);
    this.logger.log(`CONNECTED: ${socket.id} (${user.pseudo})`, "Gateway");
    console.log(this.server.of('/').adapter.sids);
    console.log(this.server.of('/').adapter.rooms);
  }

  alreadyInGame(socket: Socket) {
    socket.emit('alreadyInGame');
    console.log('--> ALREADY in Game')
    return this.disconnect(socket);
  }

  getStatus(userId: string): Status {
    if (!this.users.get(userId))
      return Status.OFFLINE;
    return (this.inGamePage.get(userId) && this.gameService.isInGame(userId)) ? Status.INGAME : Status.ONLINE;
    //return (this.users.get(userId).size) ? Status.ONLINE : Status.OFFLINE;
  }

  async joinSocketToRooms(userId: string, socket: Socket) {
    let joinedGeneral: boolean = false;
    if (!await this.chatService.insideChannel(userId, 'General')) {
      await this.chatService.joinChannel(userId, ChannelRole.USER, 'General');
      joinedGeneral = true;
    }
    let channels: string[] = await this.chatService.getChannelNamesByUserId(userId);
    console.log('=> channels rejoined', channels)
    socket.join(channels);
    if (joinedGeneral)
      await this.joinRoom(userId, 'General');
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

  async sendMessageToUser(userId: string, targetId: string, message: string, date: Date) {
    if (!this.users.get(targetId))
      return
    
    const author: string = await this.userService.getPseudoById(userId);
    this.users.get(targetId).forEach((socket) => {
      this.server.to(socket.id).emit('message', {author, message, date});
    });
  }

  async sendMessageToChannel(userId: string, channel: string, message: string, color: string) {
    const author: string = await this.userService.getPseudoById(userId);
    const messageData: eventMessageDto = {author, message, channel, color: color};
    this.server.to(channel).emit('messageRoom', messageData);
  }

  async friendEvent(eventName: string, targetId: string, authorId: string) {
    if (!this.users.get(targetId))
      return
    
    const pseudo: string = await this.userService.getPseudoById(authorId);
    if (!pseudo)
      return // a gerer mieux

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

  checkSocket(userId: string): boolean {
    return (this.inGamePage.has(userId));
  }

  levelUp(userId: string, lvl: number) {
    this.users.get(userId).forEach((socket) => {
      this.server.to(socket.id).emit('levelUp', lvl);
    });
  }

  async alertOpponent(userId: string) {
    const opponentId: string = await this.gameService.getOpponent(userId);
    if (opponentId && this.inGamePage.has(opponentId)) {
      const socket: Socket = this.inGamePage.get(opponentId);
      this.server.to(socket.id).emit('opponentDisconnect');
    }
  }

  async inviteGame(authorId: string, invitedId: string, invited: string, difficulty: Difficulty) {
    const author: string = await this.userService.getPseudoById(authorId);
    if (!author || !this.users.get(invitedId)) 
      return; // a mieux gererrr
    this.users.get(invitedId).forEach((socket) => {
      this.server.to(socket.id).emit('inviteGame', { author, invited, difficulty });
    });
  }

  async matchEvent(payload: GameEntity) {
      console.log(payload.created_at.toLocaleString('fr-FR'))
    if (!this.users.get(payload.player1Id) || !this.users.get(payload.player2Id)) {
      return;
    }
    const game: GameDto = this.gameService.gameToDto(payload);
    this.users.get(payload.player1Id).forEach((socket) => {
      this.server.to(socket.id).emit('matchEvent', game);
    });
    this.users.get(payload.player2Id).forEach((socket) => {
      this.server.to(socket.id).emit('matchEvent', game);
    });
    this.logger.log(`Match! beetwen (${game.player1} vs ${game.player2}) in [${game.difficulty}] mode`, 'GAME')
  }

  async cleanGame(userId: string) {
    //console.log('delete ingame socket !!!!!!!!!')
    if (!this.gameService.isInGame(userId)) // si pas en partie supprimer de la liste d'attente
      await this.gameService.removePlayerFromMatchmaking(userId);
    else { // sinon informer l'adversaire de la deconnection et supprimer la partie du service
      this.alertOpponent(userId);
      const game: GameEntity = await this.gameService.getLastGame(userId);
      if (game) {
        this.gameService.removeMatch(userId);
        await this.gameService.setForfeit(game);
        await this.gameService.updateForfeitScore(game, userId);
        await this.gameService.updateResults(game.id, userId);
        await this.endOfGame(game.id);
      }
    }
  }

  @SubscribeMessage('readyForGame')
  async readyEvent(@MessageBody() data: GameDto, @ConnectedSocket() socket: Socket) {
    const user: userDto = await this.authentication(socket);
    // a gerer SI ERROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOR
    if (!user)
      return;
    if (!this.ready.has(user.id))
      this.ready.add(user.id);

    const user2: UserEntity = await this.userService.findByPseudo((data.player1 === user.pseudo) ? data.player2 : data.player1);
    if (this.ready.has(user2.id))
      this.startGameEvent(data);
  }

  startGameEvent(payload: GameDto) {
    const socket1: Socket = this.inGamePage.get(payload.player1);
    const socket2: Socket = this.inGamePage.get(payload.player2);
    this.server.to([socket1.id, socket2.id]).emit('startGame', payload);
    this.ready.delete(payload.player1);
    this.ready.delete(payload.player2);
  }

  async endOfGame(gameId: string) {
    const payload: GameEntity = await this.gameService.findGameById(gameId);
    if (!payload) /////// a mieux gerer
      return;
    const socket1: Socket = this.inGamePage.get(payload.player1.id);
    const socket2: Socket = this.inGamePage.get(payload.player2.id);
    const game: GameDto = this.gameService.gameToDto(payload);
    if (socket1)
      this.server.to(socket1.id).emit('endOfGame', game);
    if (socket2)
      this.server.to(socket2.id).emit('endOfGame', game);
  }

  async handleDisconnect(socket: Socket) {
    const user: userDto = await this.authentication(socket);
    //CAS DERREUR POSSIBLE ????
    if (user) {
      if (this.users.get(user.id).has(user.socket)) {
        if (this.inGamePage.has(user.id)) {
          await this.cleanGame(user.id);
          this.gameService.deleteChallenges(user.id);
          this.inGamePage.delete(user.id); // supprimer le socket (gamePage)
        }
        this.users.get(user.id).delete(user.socket); // supprimer le socket associer
      }
    }
    this.logger.log(`DISCONNECTED: ${socket.id}`, "Gateway");
    this.server.emit('DISCONNECTED', socket.id);
  }

  //??????
  disconnect(socket: Socket, error: Error = null) {
    socket.emit('error', new Error(AboutErr.TOKEN, TypeErr.REJECTED, 'Reject connection chat socket'));
    this.logger.error(`reject connection: ${socket.id}`);
    socket.disconnect();
  }
}