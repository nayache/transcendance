import { Socket } from "socket.io-client"
import { GameDto, MoveObject } from "../interface/IGame"

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

abstract class CanvasObjectDisplayer {

	private _startingSpeed?: Vector2D;

	constructor(
		private _socket: Socket,
		private _gameInfos?: GameDto,
		private _dimensions?: Dimensions,
		private _pos?: Point,
		private _color?: string,
		private _canvas?: HTMLCanvasElement,
		private _context?: CanvasRenderingContext2D,
		private _canvasWidth?: number,
		private _canvasHeight?: number,
		private _canvasPosY?: number,
	) {
		console.log("CanvasObjectDisplayer creation")
	}

	public get socket(): Socket {
		return this._socket
	}
	
	private set socket(socket: Socket) {
		this._socket = socket
	}

	public get gameInfos(): GameDto | undefined {
		return this._gameInfos
	}
	
	private set gameInfos(gameInfos: GameDto | undefined) {
		this._gameInfos = gameInfos
	}

	public get canvas(): HTMLCanvasElement {
		if (!this._canvas)
			throw new Error('The canvas have not been set up')
		return this._canvas
	}
	
	public set canvas(canvas: HTMLCanvasElement) {
		this._canvas = canvas
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

	protected setUp(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number,
		moveObject?: MoveObject,
	): void {
		this.canvas = canvas
		this.context = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		if (canvasPosY)
			this.canvasPosY = canvasPosY;
		if (moveObject) {
			this.pos = moveObject.pos
			this.dimensions = moveObject.dimensions
			this.color = moveObject.color
		}
	}

	display(moveObject?: MoveObject): void {
		if (moveObject && this.canvas) {
			const canvasWidth = this.canvas.getBoundingClientRect().width
			const canvasHeight = this.canvas.getBoundingClientRect().height
			const canvasPosY = this.canvas.getBoundingClientRect().top
			this.pos.x = moveObject.pos.x * canvasWidth / moveObject.canvasWidth
			this.pos.y = moveObject.pos.y * canvasHeight / moveObject.canvasHeight
			this.dimensions.width = moveObject.dimensions.width * canvasWidth / moveObject.canvasWidth
			this.dimensions.height = moveObject.dimensions.height * canvasHeight / moveObject.canvasHeight
			this.color = moveObject.color
		}
		this.context.beginPath();
		this.context.fillStyle = this.color;
	}

	//collision, etc..
	//base class of paddle, ball, etc.. 
}
export default CanvasObjectDisplayer;