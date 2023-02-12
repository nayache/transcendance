import { StreamableFile } from "@nestjs/common";

export class userDto {
    constructor(p: string, a: StreamableFile, f: string[], b: string[]) {
        this.pseudo = p;
        this.avatar = a;
        this.friends = f;
        this.blockeds = b;
    }
    pseudo: string;
    avatar: StreamableFile;
    friends: string[];
    blockeds: string[];
}