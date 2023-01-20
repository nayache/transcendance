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
			{ x: _nbPlayer == 1 ? 0 + PADDLE_XSPACE : 0  ,  y: 0},
			{ width: PADDLE_WIDTH, height },
			color,
			context,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);
		document.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	private set y(y: number) {
		this.pos = { ...this.pos, y }
	}

	private get y() {
		return this.pos.y;
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
			this.pos = {...this.pos, x: this.canvasWidth - this.dimensions.width - PADDLE_XSPACE}
	}

	draw(canvasPosY?: number): void {
		if (!this.context || !this.pos || !this.dimensions)
			return ;
		this.canvasPosY = canvasPosY;
		super.draw()
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}
}
export default Paddle;