// import Ball from "./Ball.class";
// import Player from "./Player.class";
// import Paddle from "./Paddle.class";
// import Referee, { GameState } from "./Referee.class";


// class Drawer {

// 	constructor(
// 		private _ref: Referee,
// 	) {
// 		console.log("avant print (dans constructor drawer)")
// 		console.log("this._ref = ", this._ref)
// 		console.log("apres print (dans constructor drawer)")
// 	}
	
// 	public get player_left(): Player {
// 		return this.ref.player_left
// 	}
	
// 	public get player_right(): Player {
// 		return this.ref.player_right
// 	}
	
// 	public get paddle_left(): Paddle {
// 		return this.player_left.paddle
// 	}
	
// 	public get paddle_right(): Paddle {
// 		return this.player_right.paddle
// 	}
	
// 	public get ball(): Ball {
// 		return this.ref.ball
// 	}
	
// 	public get ref(): Referee {
// 		if (!this._ref)
// 			throw new Error('The ref have not been set up')
// 		return this._ref
// 	}
	
// 	public get gamestate(): GameState {
// 		return this.ref.gamestate
// 	}

	
// 	private setUpGame(
// 		canvasWidth: number,
// 		canvasHeight: number,
// 		canvas: HTMLCanvasElement
// 	) {
		
// 	}

// 	private updateGame() {
// 		this.ball.updatePos([this.paddle_left, this.paddle_right]);
// 	}

// 	public gameLoop(
// 		canvasWidth: number,
// 		canvasHeight: number,
// 		canvas: HTMLCanvasElement
// 	) {
// 		console.log("avant print")
// 		console.log("this = ", this);
// 		console.log("apres print")
// 		if (this.gamestate == GameState.WaitingForStart)
// 		{
// 			try {
// 				this.setUpGame(canvasWidth, canvasHeight, canvas)
// 			} catch (e) {}
// 		}
// 		if (this.gamestate == GameState.Running)
// 			this.updateGame()
// 		try {
// 			this.ref.referee();
// 		} catch (e) {}
// 		setInterval(requestAnimationFrame(() => this.gameLoop(canvasWidth, canvasHeight, canvas))
// 		// console.log('reqAnim = ', reqAnim);
// 	}
// }

// export default Drawer;
export default class Drawer {};