export type Point = {
	x?: number,
	y?: number
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

	private _speed: Vector2D | undefined;
	private _oldPos?: Point;

	constructor(
		private _dimensions: Dimensions = {width: 10, height: 10},
		private _pos?: Point,
		private _color: string = 'black',
		private _context?: CanvasRenderingContext2D,
		private _canvasWidth?: number,
		private _canvasHeight?: number,
		private _canvasPosY?: number,
	) {
		console.log("CanvasObject creation")
		this._speed = undefined;
		this._oldPos = _pos;
	}


	protected get context() {
		return this._context;
	}

	protected set context(ctx: CanvasRenderingContext2D | undefined) {
		this._context = ctx;
	}

	protected get canvasWidth() {
		return this._canvasWidth;
	}

	protected set canvasWidth(canvasWidth: number | undefined) {
		this._canvasWidth = canvasWidth;
	}

	protected get canvasHeight() {
		return this._canvasHeight;
	}

	protected set canvasHeight(canvasHeight: number | undefined) {
		this._canvasHeight = canvasHeight;
	}

	protected get canvasPosY() {
		return this._canvasPosY;
	}

	protected set canvasPosY(canvasPosY: number | undefined) {
		this._canvasPosY = canvasPosY;
	}
	
	public get pos() {
		return this._pos;
	}

	protected set pos(pos: Point | undefined) {
		this._oldPos = this._pos
		this._pos = pos;
	}

	protected get oldPos() {
		return this._oldPos;
	}

	private set oldPos(oldPos: Point | undefined) {
		this._oldPos = oldPos;
	}
	
	public get dimensions() {
		return this._dimensions;
	}

	protected set dimensions(dimensions: Dimensions) {
		this._dimensions = dimensions;
	}
	
	protected get color() {
		return this._color;
	}

	protected set color(color: string) {
		this._color = color;
	}
	
	public get speed() {
		return this._speed;
	}

	protected set speed(speed: Vector2D | undefined) {
		this._speed = speed;
	}

	protected setUp(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvasPosY?: number): void {
		this.context = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.canvasPosY = canvasPosY;
	}

	public isPosSetUp(): boolean {
		if (this._pos && this._pos.x && this._pos.y)
			return (true);
		return (false)
	}

	private static isBetween<T>(myItem: T, limitInf: T, limitSup: T, inclusive: boolean = true): boolean {
		if (!inclusive)
			return (myItem > limitInf && myItem < limitSup)
		return (myItem >= limitInf && myItem <= limitSup)
	}

	protected isInsideX(solidObject: CanvasObject): boolean {
		if (this.pos?.x && this.pos?.y && solidObject.pos?.x && solidObject.pos?.y)
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

	draw(): void {
		if (!this.context || !this.pos || !this.dimensions)
			return ;
		this.context.beginPath();
		this.context.fillStyle = this.color;
	}

	//collision, etc..
	//base class of paddle, ball, etc.. 
}
export default CanvasObject;