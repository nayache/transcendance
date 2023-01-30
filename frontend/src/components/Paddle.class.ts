import CanvasObject, { Point, Dimensions } from "./Object.class";

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;

interface Props {
}

class Paddle extends CanvasObject {

	constructor(
		private _nbPlayer: 1 | 2,
		height: number = 100,
		color: string = 'black',
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY: number = 0,
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

	public get nbPlayer() {
		return (this._nbPlayer);
	}

	private set y(y: number | undefined) {
		this.pos = { ...this.pos, y }
	}

	private get y() {
		return this.pos?.y;
	}

	onMouseMove(e: MouseEvent): void {
		if (!this.canvasPosY)
			this.canvasPosY = 0;
		this.y = e.clientY - this.canvasPosY - this.dimensions.height / 2;
	}

	setUp(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvasPosY?: number): void {
		super.setUp(ctx, canvasWidth, canvasHeight, canvasPosY);
		this.y = canvasHeight / 2 - this.dimensions.height / 2;
		if (this._nbPlayer == 2 && this.canvasWidth)
			this.pos = { ...this.pos, x: this.canvasWidth - this.dimensions.width - PADDLE_XSPACE }
		else
			this.pos = { ...this.pos, x: PADDLE_XSPACE }
	}

	draw(canvasPosY?: number): void {
		console.log("this.pos dans draw paddle = ", this.pos)
		if (!this.context || !this.pos?.x || !this.pos?.y || !this.dimensions)
			return ;
		this.canvasPosY = canvasPosY;
		super.draw()
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}
}
export default Paddle;