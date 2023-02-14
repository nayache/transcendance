import { Socket } from "socket.io";

export class userDto {
    id: string;
    pseudo: string;
    socket: Socket;
}