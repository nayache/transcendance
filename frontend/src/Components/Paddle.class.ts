import CanvasObject, { Point, Dimensions } from "./Object.class";

const PADDLE_WIDTH: number = 20;
const PADDLE_X: 10 | 100 = 10;

interface Props {
}

class Paddle extends CanvasObject {

	constructor(
		private _nbPlayer: 1 | 2,
		y: number = 0,
		height: number = 100,
		color: string = 'black',
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			{x: _nbPlayer == 1 ? 10 : 0, y},
			{width: PADDLE_WIDTH, height},
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

	onMouseMove(e: MouseEvent) {
		this.y = e.clientY - this.canvasPosY - this.dimensions.height / 2;
	}

	draw() {
		if (!this.context || !this.pos || !this.dimensions)
			return ;
		super.draw()
		if (this._nbPlayer == 2 && this.canvasWidth)
			this.pos = {...this.pos, x: this.canvasWidth - this.dimensions.width - 10}
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)
		this.context.fill();
	}
}
export default Paddle;