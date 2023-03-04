import { StreamableFile } from "@nestjs/common";
import { friendDto } from "src/user/user.controller";

export class userDto {
    constructor(p: string, a: StreamableFile, f: friendDto[], b: string[]) {
        this.pseudo = p;
        this.avatar = a;
        this.friends = f;
        this.blockeds = b;
    }
    pseudo: string;
    avatar: StreamableFile;
    friends: friendDto[];
    blockeds: string[];
}