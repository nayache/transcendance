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

	constructor(
		private _pos?: Point,
		private _dimensions?: Dimensions,
		private _color?: string,
		private _context?: CanvasRenderingContext2D,
		private _canvasWidth?: number,
		private _canvasHeight?: number,
	) {
		console.log("CanvasObject creation")
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
	
	public get pos() {
		return this._pos;
	}

	public set pos(pos: Point | undefined) {
		this._pos = pos;
	}
	
	public get dimensions() {
		return this._dimensions;
	}

	public set dimensions(dimensions: Dimensions | undefined) {
		this._dimensions = dimensions;
	}
	
	protected get color() {
		return this._color;
	}

	protected set color(color: string | undefined) {
		this._color = color;
	}

	setUp(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
		this.context = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		console.log('test setUp')
	}

	draw(): void {
		if (!this.context || !this.pos || !this.dimensions)
		{
			console.log("draw() dans 1er if")
			return ;
		}
		console.log("draw() apres 1er if")
		this.context.beginPath();
		this.context.fillStyle = <string>this.color;
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

	//collision, etc..
	//base class of paddle, ball, etc.. 
}
export default CanvasObject;