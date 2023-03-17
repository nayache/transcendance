import BallDisplayer from "./BallDisplayer.class";
import PlayerDisplayer from "./PlayerDisplayer.class";
import PaddleDisplayer from "./PaddleDisplayer.class";
import RefereeDisplayer, { GameState } from "./RefereeDisplayer.class";
import { MoveObject, MoveObjects } from "../interface/IGame";


class DrawerDisplayer {

	private _reqAnim?: number;


	constructor(
		private _leftPlayer: PlayerDisplayer,
		private _rightPlayer: PlayerDisplayer,
		private _ball: BallDisplayer,
		private _maxGoals: number = 5
		// private _ref: RefereeDisplayer,
	) {
		console.log("avant print (dans constructor drawer)")
		// console.log("this._ref = ", this._ref)
		console.log("apres print (dans constructor drawer)")
	}
	
	public get leftPlayer(): PlayerDisplayer {
		return this._leftPlayer
	}
	
	public get rightPlayer(): PlayerDisplayer {
		return this._rightPlayer
	}
	
	public get leftPaddle(): PaddleDisplayer {
		return this.leftPlayer.paddle
	}
	
	public get rightPaddle(): PaddleDisplayer {
		return this.rightPlayer.paddle
	}
	
	public get ball(): BallDisplayer {
		return this._ball
	}
	
	private set reqAnim(reqAnim: number) {
		this._reqAnim = reqAnim
	}
	
	public get reqAnim(): number {
		if (!this._reqAnim)
			throw new Error('The reqAnim have not been set up')
		return this._reqAnim
	}


	private clearBgnd(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number
	) {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	private drawMiddleLine(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number
	) {
		const middleWidth = canvasWidth / 2;
		const lineWidth = canvasWidth / 100;
	
		context.beginPath();
		context.lineWidth = lineWidth;
		context.setLineDash([20, 15]);
		context.moveTo(middleWidth, 0);
		context.lineTo(middleWidth, canvasHeight);
		context.stroke();
	}
	
	private drawBgnd(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number
	) {
		context.fillStyle = 'white';
		context.fillRect(0, 0, canvasWidth, canvasHeight);
		this.drawMiddleLine(context, canvasWidth, canvasHeight);
	}
	
	
	public setUpGame(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvas: HTMLCanvasElement,
		moveObjects?: MoveObjects
	) {
		this.drawBgnd(context, canvasWidth, canvasHeight)
		this.leftPaddle.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top, moveObjects?.leftPaddle);
		this.rightPaddle.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top, moveObjects?.rightPaddle);
		this.ball.setUp(context, canvasWidth, canvasHeight, undefined, moveObjects?.ball);
	}

	private updateGame(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvas: HTMLCanvasElement
	) {
		
		this.clearBgnd(context, canvasWidth, canvasHeight);
		this.drawBgnd(context, canvasWidth, canvasHeight);
		this.leftPaddle.display();
		this.rightPaddle.display();
		this.ball.display();
		// ball.updatePos([leftPaddle, rightPaddle]);
	}

	public gameLoop(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvas: HTMLCanvasElement
	) {
		this.updateGame(context, canvasWidth, canvasHeight, canvas)
		this.reqAnim = requestAnimationFrame(() => this.gameLoop(context, canvasWidth, canvasHeight, canvas))
		// console.log('reqAnim = ', reqAnim);
	}
}

export default DrawerDisplayer;