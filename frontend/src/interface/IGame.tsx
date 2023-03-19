import { Dimensions, Point } from "../components/CanvasObjectDisplayer.class";

export interface IGameInviteEv {
	author: string,
	invited: string,
	difficulty: Difficulty
}

export interface MoveObject {
	userId: string
	pos: Point
	dimensions: Dimensions,
	color: string
}

export interface PlayerDto {
	id: string,
	pseudo: string;
}

export interface MoveObjects {
	leftPaddle: MoveObject,
	rightPaddle: MoveObject,
	ball: MoveObject
}

export interface CanvasUtils {
	w: number,
	h: number,
	y: number,
}

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export interface GameDto {
	id: string;
	ranked: boolean;
	difficulty: Difficulty;
	player1: PlayerDto
	player2: PlayerDto;
	score1: number;
	score2: number;
	forfeit: boolean;
	xp1: number;
	xp2: number;
	date: Date;
}