import { Relation } from "src/enums/relation.enum";

export class ProfileDto {
    avatar: string;
    pseudo: string;
    friends?: number;
    level: number;
    wins: number;
    looses: number;
    history: string = null;
    relation?: Relation;
    blocked?: boolean;
}
