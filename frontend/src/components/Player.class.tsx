import Paddle from "./Paddle.class";

export enum PlayerSide {
	Left = 1,
	Right
}

class Player {

	private _nbGoals: number;
	private _ready: boolean;

	constructor(
		private _playerNb: PlayerSide,
		private _paddle: Paddle,
	) {
		this._paddle.bindToplayer(this)
		this._nbGoals = 0;
		this._ready = false;
	}


	public get paddle(): Paddle {
		return this._paddle;
	}

	public get nbGoals(): number {
		return this._nbGoals;
	}
	
	private set nbGoals(nbGoals : number) {
		this._nbGoals = nbGoals;
	}

	public get playerNb(): PlayerSide {
		return this._playerNb;
	}
	
	public get ready(): boolean {
		return this._ready;
	}
	
	private set ready(ready: boolean) {
		this._ready = ready;
	}


	public addOneGoal() {
		this.nbGoals++;
	}
	
	// public setToReady(): boolean {
	// 	this.ready = true
	// }
}

export default Player;