import CanvasObject, { Point, Dimensions } from "./CanvasObject.class";
import Player, { PlayerSide } from "./Player.class";

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;


class Paddle extends CanvasObject {

	constructor(	
		private _player?: Player,
		height: number = 100,
		color: string = 'black',
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			{ width: PADDLE_WIDTH, height },
			undefined,
			color,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);
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
		try {
			// this.pos.y = e.clientY - this.canvasPosY - this.dimensions.height / 2;
			this.pos.y = e.clientY;
		} catch (err) {
		}
	}

	setUp(
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number
	): void {
		let y: number;

		super.setUp(canvasWidth, canvasHeight, canvasPosY);
		try {
			y = this.pos.y;
		} catch (err) {
			y = canvasHeight / 2 - this.dimensions.height / 2
		}
		if (this.player.playerSide == PlayerSide.Right && this.canvasWidth)
			this.pos = { x: this.canvasWidth - this.dimensions.width - PADDLE_XSPACE, y }
		else
			this.pos = { x: PADDLE_XSPACE, y }
	}

}
export default Paddle;