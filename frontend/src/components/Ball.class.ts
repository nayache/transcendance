import React from 'react'
import CanvasObject, { Point, Dimensions, Vector2D, Side } from './Object.class';

class Ball extends CanvasObject {

	constructor(
		radius: number = 10,
		color: string = 'grey',
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			{ width: radius, height: radius },
			undefined,
			color,
			context,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);

	}

	public get radius(): number {
		return (this.dimensions.width);
	}

	/* private */ public set radius(radius: number) {
		this.dimensions.width = radius;
		this.dimensions.height = radius;
	}

	public setUp(
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number,
		speed?: Vector2D
	): void {
		super.setUp(ctx, canvasWidth, canvasHeight, canvasPosY);
		if (speed)
			this.speed = speed;
		else
			this.speed = { x: 5, y: 6 }
		this.pos = { x: canvasWidth / 2, y: canvasHeight / 2 }
		//set une vitesse ou un bail comme ca
	}

	public updatePos(solidObjects?: CanvasObject[]): void {
		const x: number | undefined = this.pos?.x;
		const y: number | undefined = this.pos?.y;
		let speed: Vector2D;
		let sideTouched: Side;

		if (!this.speed)
			this.speed = { x: 2, y: -4 }
		speed = this.speed;
		if (this.canvasWidth && this.canvasHeight)
		{
			if (solidObjects)
			{
				for (let i = 0; i < solidObjects.length; i++) {
					const solidObject = solidObjects[i];
					console.log("this.speed.x dans if = ", this.speed.x);
					// console.log("this.pos.x - this.radius = ", this.pos?.x - this.radius)
					console.log("solidObject.pos.x = ", solidObject.pos?.x);
					if (this.isInsideX(solidObject))
					{
						speed = { ...this.speed, x: -this.speed.x }
						if (this.pos?.x && solidObject.pos?.x && this.speed.x < 0)
							this.pos.x = solidObject.pos.x + solidObject.dimensions.width + this.radius;
						else if (this.pos?.x && solidObject.pos?.x && this.speed.x > 0)
							this.pos.x = solidObject.pos.x - this.radius;
					}
					/*
					sideTouched = this.isInsideY(solidObject);
					if (sideTouched != Side.NoSide)
					{
						const a = new Map<Side, string>([
							[Side.Top, "top"],
							[Side.Right, "right"],
							[Side.Bottom, "bottom"],
							[Side.Left, "left"],
						]);
						console.log("sideTouched = ", a.get(sideTouched))
						if (sideTouched == Side.Top)
						{
							if (this.speed.y > 0)
								speed = { ...this.speed, y: -Math.abs(this.speed.y) }
							else
								speed =  { ...this.speed, y: Math.abs(this.speed.y * 1.3) }
							this.pos.y = solidObject.pos.y - this.radius;
						}
						else if (sideTouched == Side.Bottom)
						{
							if (this.speed.y < 0)
								speed = { ...this.speed, y: -Math.abs(this.speed.y) }
							else
								speed =  { ...this.speed, y: Math.abs(this.speed.y * 1.3) }
							this.pos.y = solidObject.pos.y + solidObject.dimensions.width + this.radius;
						}
					}
					*/
				}
				this.speed = speed;
			}
			console.log("this.speed.x a l'exterieur du if = ", this.speed.x);
			if (this.pos?.x && this.pos?.y &&
				(this.pos.y - this.radius < 0 || this.pos.y + this.radius > this.canvasHeight))
				this.speed.y = -this.speed.y;
			else
				console.log("nope y, this.pos = ", this.pos, " et this.canvasHeight = ", this.canvasHeight);
		}
		this.pos = {
			x: x ? x + this.speed.x : undefined,
			y: y ? y + this.speed.y : undefined
		}
	}

	draw(): void {
		if (!this.context || !this.pos?.x || !this.pos?.y || !this.dimensions)
			return ;
		super.draw();
		this.context.arc(
			this.pos.x,
			this.pos.y,
			this.radius,
			0,
			2 * Math.PI
		)
		this.context.fill();
	}
}

export default Ball;