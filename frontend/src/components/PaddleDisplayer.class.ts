import { Socket } from "socket.io-client";
import { GameDto, MoveObject } from "../interface/IGame";
import CanvasObjectDisplayer, { Point, Dimensions } from "./CanvasObjectDisplayer.class";
import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;


class PaddleDisplayer extends CanvasObjectDisplayer {

	private _plugMove: boolean = false;

	constructor(
		socket: Socket,
		private _player?: PlayerDisplayer,
		gameInfos?: GameDto,
		height: number = 100,
		color: string = 'black',
		canvas?: HTMLCanvasElement,
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			socket,
			gameInfos,
			{ width: PADDLE_WIDTH, height },
			undefined,
			color,
			canvas,
			context,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);
		if (canvas && gameInfos && this._plugMove)
			canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	public bindToplayer(player: PlayerDisplayer) {
		this._player = player;
	}
	
	public get player(): PlayerDisplayer {
		if (!this._player)
			throw new Error('The player have not been set up');
		return this._player;
	}

	public get plugMove(): boolean {
		return this._plugMove
	}
	
	public set plugMove(plugMove: boolean) {
		this._plugMove = plugMove
	}


	onMouseMove(e: MouseEvent): void {
		if (this.gameInfos)
			this.socket.emit('paddleMove', {
				gameId: this.gameInfos.id,
				clientY: e.clientY,
				canvasPosY: this.canvas.getBoundingClientRect().top,
				canvasHeight: this.canvas.getBoundingClientRect().height
			})
	}

	setUp(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number,
		moveObject?: MoveObject,
	): void {
		let y: number;

		super.setUp(canvas, ctx, canvasWidth, canvasHeight, canvasPosY, moveObject);
		// console.log("this.plugMove = ", this.plugMove)
		if (canvas && this.gameInfos)
			canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
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


	handleResize(
		canvas?: HTMLCanvasElement,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	): void {
		super.handleResize(canvas, canvasWidth, canvasHeight, canvasPosY)
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}



	display(
		moveObject?: MoveObject,
		canvas?: HTMLCanvasElement,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number
	): void {
		super.display(moveObject, canvas, canvasWidth, canvasHeight, canvasPosY)
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}
}
export default PaddleDisplayer;
