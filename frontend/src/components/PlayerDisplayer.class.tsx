import { PlayerDto } from "../interface/IGame";
import PaddleDisplayer from "./PaddleDisplayer.class";

export enum PlayerSide {
	Left = 1,
	Right
}

class PlayerDisplayer {

	private _nbGoals: number;
	private _ready: boolean;

	constructor(
		private _playerSide: PlayerSide,
		private _paddle: PaddleDisplayer,
		private _playerDto?: PlayerDto,
	) {
		this._paddle.bindToplayer(this)
		this._nbGoals = 0;
		this._ready = false;
	}


	public get paddle(): PaddleDisplayer {
		return this._paddle;
	}

	public get nbGoals(): number {
		return this._nbGoals;
	}
	
	private set nbGoals(nbGoals : number) {
		this._nbGoals = nbGoals;
	}

	public get playerSide(): PlayerSide {
		return this._playerSide;
	}
	
	public get ready(): boolean {
		return this._ready;
	}
	
	public set ready(ready: boolean) {
		this._ready = ready;
	}

	private set playerDto(playerDto: PlayerDto) {
		this._playerDto = playerDto
	}
	
	public get playerDto(): PlayerDto {
		if (!this._playerDto)
			throw new Error('The playerDto have not been set up')
		return this._playerDto
	}


	public addOneGoal() {
		this.nbGoals++;
	}
}

export default PlayerDisplayer;