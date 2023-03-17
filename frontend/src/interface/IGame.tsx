export interface PlayerDto {
	id: string,
	pseudo: string;
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