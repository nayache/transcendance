export type Point = {
	x: number,
	y: number
}

export type Vector2D = {
	x: number,
	y: number
}

export type Dimensions = {
	width: number,
	height: number
}

export enum Side {
	NoSide = -1,
	Top,
	Right,
	Bottom,
	Left
}

abstract class CanvasObject {

	private _startingSpeed?: Vector2D;

	constructor(
		private _dimensions?: Dimensions,
		private _pos?: Point,
		private _color?: string,
		private _context?: CanvasRenderingContext2D,
		private _canvasWidth?: number,
		private _canvasHeight?: number,
		private _canvasPosY?: number,
	) {
		console.log("CanvasObject creation")
	}


	protected get context() {
		if (!this._context)
			throw new Error('The context have not been set up')
		return this._context;
	}

	protected set context(ctx: CanvasRenderingContext2D) {
		this._context = ctx;
	}

	protected get canvasWidth() {
		if (!this._canvasWidth)
			throw new Error('The canvasWidth have not been set up')
		return this._canvasWidth;
	}

	protected set canvasWidth(canvasWidth: number) {
		this._canvasWidth = canvasWidth;
	}

	protected get canvasHeight() {
		if (!this._canvasHeight)
			throw new Error('The canvasHeight have not been set up')
		return this._canvasHeight
	}

	protected set canvasHeight(canvasHeight: number) {
		this._canvasHeight = canvasHeight;
	}

	protected get canvasPosY() {
		if (!this._canvasPosY)
			throw new Error('The canvasPosY have not been set up')
		return this._canvasPosY;
	}

	protected set canvasPosY(canvasPosY: number) {
		this._canvasPosY = canvasPosY;
	}
	
	public get pos() {
		if (!this._pos)
			throw new Error('The pos have not been set up')
		return this._pos;
	}
	
	public set pos(pos: Point) {
		this._pos = pos;
	}
	
	public get dimensions() {
		if (!this._dimensions)
			throw new Error('The dimen_dimensions have not been set up')
		return this._dimensions;
	}

	protected set dimensions(dimensions: Dimensions) {
		this._dimensions = dimensions;
	}
	
	protected get color() {
		if (!this._color)
			throw new Error('The dimen_color have not been set up')
		return this._color;
	}

	protected set color(color: string) {
		this._color = color;
	}
	
	public get startingSpeed() {
		if (!this._startingSpeed)
			throw new Error('The startingSpeed have not been set up')
		return this._startingSpeed;
	}

	protected set startingSpeed(startingSpeed: Vector2D) {
		this._startingSpeed = startingSpeed;
	}

	protected setUp(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvasPosY?: number): void {
		this.context = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		if (canvasPosY)
			this.canvasPosY = canvasPosY;
	}

	protected static isBetween<T>(myItem: T, limitInf: T, limitSup: T, inclusive: boolean = true): boolean {
		if (!inclusive)
			return (myItem > limitInf && myItem < limitSup)
		return (myItem >= limitInf && myItem <= limitSup)
	}

	protected static randomIntFromInterval(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	protected static randomIntFrom2Intervals(interval1: [number, number], interval2: [number, number]): number {
		if (Math.random() > 0.5)
			return CanvasObject.randomIntFromInterval(interval1[0], interval1[1])
		else
			return CanvasObject.randomIntFromInterval(interval2[0], interval2[1])
	}

	public isInsideX(solidObject: CanvasObject): boolean {
		if (
			(this.pos.x - this.dimensions.width <= solidObject.pos.x + solidObject.dimensions.width &&
			this.pos.x + this.dimensions.width >= solidObject.pos.x) &&
			(this.pos.y - this.dimensions.height <= solidObject.pos.y + solidObject.dimensions.height &&
			this.pos.y + this.dimensions.height >= solidObject.pos.y)// &&
			// (this.oldPos.y - this.dimensions.height <= solidObject.pos.y + solidObject.dimensions.height &&
			// this.oldPos.y + this.dimensions.height >= solidObject.pos.y)
		)
			return (true);
		return (false);
	}
	
	// !!! DEPRECATED !!! //
	/*
	protected isInsideY(solidObject: CanvasObject): Side {
		const absDistanceUp: number = Math.abs(this.pos.y - solidObject.pos.y);
		const absDistanceDown: number = Math.abs(this.pos.y - (solidObject.pos.y + solidObject.dimensions.height));
		
		if (
			(this.pos.y - this.dimensions.height <= solidObject.pos.y + solidObject.dimensions.height &&
			this.pos.y + this.dimensions.height >= solidObject.pos.y) &&
			(this.pos.x - this.dimensions.width <= solidObject.pos.x + solidObject.dimensions.width &&
			this.pos.x + this.dimensions.width >= solidObject.pos.x) &&
			(this.oldPos.x - this.dimensions.width <= solidObject.pos.x + solidObject.dimensions.width &&
			this.oldPos.x + this.dimensions.width >= solidObject.pos.x)
		)
		{
			if (absDistanceUp < absDistanceDown)
				return (Side.Top);
			else
				return (Side.Bottom);
		}
		return (Side.NoSide);
	}
	*/

	display(): void {
		this.context.beginPath();
		this.context.fillStyle = this.color;
	}

	//collision, etc..
	//base class of paddle, ball, etc.. 
}
export default CanvasObject;