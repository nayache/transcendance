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

export enum Achievement {
	FIRSTWIN = "FirstWin",
	PERFECTWIN = "PerfectWin",
	MASTERMIND = "MasterMind",
}


export interface IProfile {
	pseudo: string,
	avatar: string,
	friends: number,
	level: number,
	xp: number,
	requiredXp: number,
	percentageXp: number,
	achievements: Achievement[],
	wins: number,
	loses: number,
	history: GameDto[],
}