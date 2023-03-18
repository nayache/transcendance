import { Socket } from "socket.io-client";
import { MoveObject } from "../interface/IGame";
import CanvasObjectDisplayer, { Point, Dimensions } from "./CanvasObjectDisplayer.class";
import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;


class PaddleDisplayer extends CanvasObjectDisplayer {

	constructor(
		socket: Socket,
		private _player?: PlayerDisplayer,
		height: number = 100,
		color: string = 'black',
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			socket,
			{ width: PADDLE_WIDTH, height },
			undefined,
			color,
			context,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);
		document.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	public bindToplayer(player: PlayerDisplayer) {
		this._player = player;
	}
	
	public get player(): PlayerDisplayer {
		if (!this._player)
			throw new Error('The player have not been set up');
		return this._player;
	}


	onMouseMove(e: MouseEvent): void {
		this.socket.emit('paddleMove', e)
	}

	setUp(
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number,
		moveObject?: MoveObject,
	): void {
		let y: number;

		super.setUp(ctx, canvasWidth, canvasHeight, canvasPosY, moveObject);
		try {
			y = this.pos.y;
		} catch (err) {
			y = canvasHeight / 2 - this.dimensions.height / 2
		}
		if (this.player.playerSide == PlayerSide.Right && this.canvasWidth)
			this.pos = { x: this.canvasWidth - this.dimensions.width - PADDLE_XSPACE, y }
		else
			this.pos = { x: PADDLE_XSPACE, y }
		super.display(moveObject)
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}


	// display(canvasPosY?: number): void {
	// 	console.log("this.pos dans display paddle = ", this.pos)
	// 	if (canvasPosY)
	// 		this.canvasPosY = canvasPosY;
	// 	super.display()
	// 	this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
	// 	this.context.fill();
	// }

	display(moveObject?: MoveObject): void {
		console.log("this.pos dans display paddle = ", this.pos)
		super.display(moveObject)
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}
}
export default PaddleDisplayer;