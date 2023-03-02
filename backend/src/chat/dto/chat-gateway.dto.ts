import { Socket } from "socket.io";

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

export class eventRoomDto {
  pseudo: string;
  channel: string;
  color: string;
}