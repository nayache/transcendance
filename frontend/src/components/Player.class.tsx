import Paddle from "./Paddle.class";

export enum PlayerSide {
	Left = 1,
	Right
}

class Player {

	private _nbGoals: number;
	private _ready: boolean;

	constructor(
		private _playerSide: PlayerSide,
		private _paddle: Paddle,
		private _userId: string
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

	public get playerSide(): PlayerSide {
		return this._playerSide;
	}
	
	public get ready(): boolean {
		return this._ready;
	}
	
	public set ready(ready: boolean) {
		this._ready = ready;
	}

	private set userId(userId: string) {
		this._userId = userId
	}
	
	public get userId(): string {
		if (!this._userId)
			throw new Error('The userId have not been set up')
		return this._userId
	}


	public addOneGoal() {
		this.nbGoals++;
	}
}

export default Player;