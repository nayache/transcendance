import BallDisplayer from "./BallDisplayer.class";
import PlayerDisplayer from "./PlayerDisplayer.class";
import PaddleDisplayer from "./PaddleDisplayer.class";
import RefereeDisplayer, { GameState } from "./RefereeDisplayer.class";


class DrawerDisplayer {

	private _reqAnim?: number;

	constructor(
		private _ref: RefereeDisplayer,
	) {
		console.log("avant print (dans constructor drawer)")
		console.log("this._ref = ", this._ref)
		console.log("apres print (dans constructor drawer)")
	}
	
	public get player_left(): PlayerDisplayer {
		return this.ref.player_left
	}
	
	public get player_right(): PlayerDisplayer {
		return this.ref.player_right
	}
	
	public get paddle_left(): PaddleDisplayer {
		return this.player_left.paddle
	}
	
	public get paddle_right(): PaddleDisplayer {
		return this.player_right.paddle
	}
	
	public get ball(): BallDisplayer {
		return this.ref.ball
	}
	
	public get ref(): RefereeDisplayer {
		if (!this._ref)
			throw new Error('The ref have not been set up')
		return this._ref
	}
	
	public get gamestate(): GameState {
		return this.ref.gamestate
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
	
	// private setUpGame(
	// 	context: CanvasRenderingContext2D,
	// 	canvasWidth: number,
	// 	canvasHeight: number,
	// 	canvas: HTMLCanvasElement
	// ) {
	// 	this.drawBgnd(context, canvasWidth, canvasHeight)
	// 	this.paddle_left.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
	// 	this.paddle_right.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
	// 	this.ball.setUp(context, canvasWidth, canvasHeight, undefined);
	// 	//on va set 2 boutons qui vont permettre de mettre respectivement les 2 joueurs prets a jouer,
	// 	// quand les 2 joueurs sont prets, ca demarre
	// 	this.player_left.ready = true
	// 	this.player_right.ready = true
	// 	// if (player1.isReadyToPlay && player2.isReadyToPlay || true)
	// }

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

	private updateGame(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvas: HTMLCanvasElement
	) {
		const { paddle_left, paddle_right, ball } = this
		
		this.clearBgnd(context, canvasWidth, canvasHeight);
		this.drawBgnd(context, canvasWidth, canvasHeight);
		// paddle_left.display(canvas.getBoundingClientRect().top);
		// paddle_right.display(canvas.getBoundingClientRect().top);
		// ball.display();
		// ball.updatePos([paddle_left, paddle_right]);
	}

	public gameLoop(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvas: HTMLCanvasElement
	) {
		console.log("avant print")
		console.log("this = ", this);
		console.log("apres print")
		if (this.gamestate == GameState.WaitingForStart)
		{
			try {
				// this.setUpGame(context, canvasWidth, canvasHeight, canvas)
			} catch (e) {}
		}
		if (this.gamestate == GameState.Running)
			this.updateGame(context, canvasWidth, canvasHeight, canvas)
		try {
			this.ref.referee();
		} catch (e) {}
		this.reqAnim = requestAnimationFrame(() => this.gameLoop(context, canvasWidth, canvasHeight, canvas))
		// console.log('reqAnim = ', reqAnim);
	}
}

export default DrawerDisplayer;