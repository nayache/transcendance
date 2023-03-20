import { GameDto } from "./IGame"

export enum Relation {
	UNKNOWN,
	PENDING,
	FRIEND
}

export interface IUser {
	pseudo?: string,
	avatar?: string
}

export interface IProfile {
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