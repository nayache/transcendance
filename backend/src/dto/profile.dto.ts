import { GameDto } from "src/chat/app.gateway";
import { Relation } from "src/enums/relation.enum";

export class ProfileDto {
    avatar: string;
    pseudo: string;
    friends?: number;
    level: number;
    xp: number;
    requiredXp: number;
    percentageXp: number;
    achievements: string[];
    wins: number;
    looses: number;
    history: GameDto[];
    relation?: Relation;
    blocked?: boolean;
}
