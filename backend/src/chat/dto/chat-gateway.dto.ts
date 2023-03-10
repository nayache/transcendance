import { Socket } from "socket.io";
import { ChannelUserDto } from "../chat.controller";

export class userDto {
  id: string;
  pseudo: string;
  socket: Socket;
}

export class eventMessageDto {
  author: string;
  message: string;
  channel: string;
  color: string;
}

export class joinRoomDto {
  channel: string;
  user: ChannelUserDto;
}

export class leaveRoomDto {
  channel: string;
  pseudo: string;
}

export class kickBanDto {
  channel: string;
  author: ChannelUserDto;
  target: string;
  action: string;
}

export class muteDto {
  channel: string;
  author: ChannelUserDto;
  target: ChannelUserDto;
  expiration: Date;
}