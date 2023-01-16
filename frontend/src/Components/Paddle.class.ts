import CanvasObject, { Point, Dimensions } from "./Object.class";

interface Props {
}

class Paddle extends CanvasObject {

	constructor(
		height: number,
		pos?: Point,
		color?: string,
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
	) {
		super(
			pos,
			{width: 20, height: height},
			color,
			context,
			canvasWidth,
			canvasHeight
		);
	}

	draw() {
		if (!this.context || !this.pos || !this.dimensions)
		{
			console.log("draw() dans 1er if")
			return ;
		}
		super.draw()
		this.context.rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height, )
		this.context.fill();
	}
}
export default Paddle;