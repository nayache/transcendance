export type Point = {
	x: number,
	y: number
}

export type Dimensions = {
	width: number,
	height: number
} 

abstract class CanvasObject {

	private _isCollisionActive: boolean;
	private _speed: number | undefined;

	constructor(
		private _pos: Point = {x: 0, y: 0},
		private _dimensions: Dimensions = {width: 10, height: 10},
		private _color: string = 'black',
		private _context?: CanvasRenderingContext2D,
		private _canvasWidth?: number,
		private _canvasHeight?: number,
		private _canvasPosY: number = 0,
	) {
		console.log("CanvasObject creation")
		this._speed = undefined;
		this._isCollisionActive = true;
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

	protected set canvasPosY(canvasPosY: number) {
		this._canvasPosY = canvasPosY;
	}
	
	public get pos() {
		return this._pos;
	}

	protected set pos(pos: Point) {
		this._pos = pos;
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
	
	protected get speed() {
		return this._speed;
	}

	protected set speed(speed: number | undefined) {
		this._speed = speed;
	}

	protected set isCollisionActive(isActive: boolean) {
		if (isActive)
		{

		}
		this._isCollisionActive = isActive;
	}

	protected get isCollisionActive(): boolean {
		return (this._isCollisionActive);
	}

	setUp(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvasPosY: number) {
		this.context = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.canvasPosY = canvasPosY;
	}

	draw(): void {
		if (!this.context || !this.pos || !this.dimensions)
			return ;
		this.context.beginPath();
		this.context.fillStyle = <string>this.color;
	}

	//collision, etc..
	//base class of paddle, ball, etc.. 
}
export default CanvasObject;