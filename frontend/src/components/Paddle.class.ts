import CanvasObject, { Point, Dimensions } from "./CanvasObject.class";
import Player, { PlayerSide } from "./Player.class";

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;

interface Props {
}

class Paddle extends CanvasObject {

	constructor(	
		private _player?: Player,
		height: number = 100,
		color: string = 'black',
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
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

	public bindToplayer(player: Player) {
		this._player = player;
	}
	
	public get player(): Player {
		if (!this._player)
			throw new Error('The player have not been set up');
		return this._player;
	}


	onMouseMove(e: MouseEvent): void {
		if (!this.canvasPosY)
			this.canvasPosY = 0;
		// if (this.pos)
			this.pos.y = e.clientY - this.canvasPosY - this.dimensions.height / 2;
	}

	setUp(
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number
	): void {
		super.setUp(ctx, canvasWidth, canvasHeight, canvasPosY);
		const y: number = canvasHeight / 2 - this.dimensions.height / 2;
		if (this.player.playerNb == PlayerSide.Right && this.canvasWidth)
			this.pos = { x: this.canvasWidth - this.dimensions.width - PADDLE_XSPACE, y }
		else
			this.pos = { x: PADDLE_XSPACE, y }
	}

	display(canvasPosY?: number): void {
		console.log("this.pos dans display paddle = ", this.pos)
		if (canvasPosY)
			this.canvasPosY = canvasPosY;
		super.display()
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}
}
export default Paddle;