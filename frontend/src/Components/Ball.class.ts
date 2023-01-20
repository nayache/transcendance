import React from 'react'
import CanvasObject, { Point, Dimensions, Vector2D } from './Object.class';

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
			{ x: 0, y: 0 },
			{ width: radius, height: radius },
			color,
			context,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);

	}

	private get radius(): number {
		return (this.dimensions.width);
	}

	private set radius(radius: number) {
		this.dimensions.width = radius;
		this.dimensions.height = radius;
	}

	setUp(
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

	updatePos(solidObjects?: CanvasObject[]): void {
		const x: number = this.pos.x;
		const y: number = this.pos.y;
		let speed: Vector2D;

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
					console.log("this.pos.x - this.radius = ", this.pos.x - this.radius)
					console.log("solidObject.pos.x = ", solidObject.pos.x);
					if ((this.pos.x < solidObject.pos.x + solidObject.dimensions.width &&
						this.pos.x > solidObject.pos.x) &&
						(this.pos.y < solidObject.pos.y + solidObject.dimensions.height &&
						this.pos.y > solidObject.pos.y))
					{
						speed = { ...this.speed, x: -this.speed.x }
						if (this.speed.x < 0)
							this.pos.x = solidObject.pos.x + solidObject.dimensions.width + this.radius;
						else if (this.speed.x > 0)
							this.pos.x = solidObject.pos.x - this.radius;
					}
				}
				this.speed = speed;
			}
			console.log("this.speed.x a l'exterieur du if = ", this.speed.x);
			if (this.pos.y < 0 || this.pos.y > this.canvasHeight)
				this.speed.y = -this.speed.y;
			else
				console.log("nope y, this.pos = ", this.pos, " et this.canvasHeight = ", this.canvasHeight);
		}
		this.pos = {
			x: x + this.speed.x,
			y: y + this.speed.y
		}
	}

	draw(): void {
		if (!this.context || !this.pos || !this.dimensions)
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