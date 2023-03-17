import PaddleDisplayer from "./PaddleDisplayer.class";

export enum PlayerSide {
	Left = 1,
	Right
}

class Player {

	private _nbGoals: number;
	private _ready: boolean;

	constructor(
		private _playerSide: PlayerSide,
		private _paddle: PaddleDisplayer,
	) {
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


	public addOneGoal() {
		this.nbGoals++;
	}
}

export default Player;