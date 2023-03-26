import React from 'react'
import CanvasObject, { Point, Dimensions, Vector2D, Side } from './CanvasObject.class';

class Ball extends CanvasObject {

	constructor(
		radius: number = 10,
		color: string = 'grey',
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			{ width: radius, height: radius },
			undefined,
			color,
			canvasWidth,
			canvasHeight,
			canvasPosY,
		);

	}

	public get radius(): number {
		return (this.dimensions.width / 2);
	}

	public set radius(radius: number) {
		this.dimensions.width = radius * 2;
		this.dimensions.height = radius * 2;
	}


	// 
	public isInsideX(solidObject: CanvasObject): boolean {
		if (
			(this.pos.x - this.radius <= solidObject.pos.x + solidObject.dimensions.width &&
			this.pos.x + this.radius >= solidObject.pos.x) &&
			(this.pos.y <= solidObject.pos.y + solidObject.dimensions.height &&
			this.pos.y >= solidObject.pos.y)// &&
			// (this.oldPos.y - this.dimensions.height <= solidObject.pos.y + solidObject.dimensions.height &&
			// this.oldPos.y + this.dimensions.height >= solidObject.pos.y)
		)
			return (true);
		return (false);
	}

	public setUp(
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number,
		startingSpeed?: Vector2D
	): void {
		super.setUp(canvasWidth, canvasHeight, canvasPosY);
		if (startingSpeed)
			this.startingSpeed = startingSpeed;
		else
			this.startingSpeed = {
				x: CanvasObject.randomIntFrom2Intervals([-5, -3], [3, 5]),
				y: CanvasObject.randomIntFrom2Intervals([-5, -3], [3, 5])
			}
		this.pos = { x: canvasWidth / 2, y: canvasHeight / 2 }
		//set une vitesse ou un bail comme ca
	}

	public updatePos(solidObjects?: CanvasObject[]): void {
		let startingSpeed: Vector2D;
		let sideTouched: Side;

		startingSpeed = this.startingSpeed;
		if (solidObjects)
		{
			for (let i = 0; i < solidObjects.length; i++) {
				const solidObject = solidObjects[i];
				// console.log("this.startingSpeed.x dans if = ", this.startingSpeed.x);
				// // console.log("this.pos.x - this.radius = ", this.pos.x - this.radius)
				// console.log("solidObject.pos.x = ", solidObject.pos.x);
				if (this.isInsideX(solidObject))
				{
					startingSpeed = { ...this.startingSpeed, x: -this.startingSpeed.x }
					if (this.startingSpeed.x < 0)
						this.pos.x = solidObject.pos.x + solidObject.dimensions.width + this.radius;
					else if (this.startingSpeed.x > 0)
					{
						// console.log("this.pos.x dans le iffffffffffffffffffffffff tu connais = ", this.pos.x)
						this.pos.x = solidObject.pos.x - this.radius;
						// console.log("this.pos.x dans le iffffffffffffffffffffffff tu connais apres = ", this.pos.x)
					}
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
					// console.log("sideTouched = ", a.get(sideTouched))
					if (sideTouched == Side.Top)
					{
						if (this.startingSpeed.y > 0)
							startingSpeed = { ...this.startingSpeed, y: -Math.abs(this.startingSpeed.y) }
						else
							startingSpeed =  { ...this.startingSpeed, y: Math.abs(this.startingSpeed.y * 1.3) }
						this.pos.y = solidObject.pos.y - this.radius;
					}
					else if (sideTouched == Side.Bottom)
					{
						if (this.startingSpeed.y < 0)
							startingSpeed = { ...this.startingSpeed, y: -Math.abs(this.startingSpeed.y) }
						else
							startingSpeed =  { ...this.startingSpeed, y: Math.abs(this.startingSpeed.y * 1.3) }
						this.pos.y = solidObject.pos.y + solidObject.dimensions.width + this.radius;
					}
				}
				*/
			}
			this.startingSpeed = startingSpeed;
		}
		// console.log("this.startingSpeed.x a l'exterieur du if = ", this.startingSpeed.x, " et this.pos = ", this.pos);
		if (this.pos.y - this.radius < 0 || this.pos.y + this.radius > this.canvasHeight)
			this.startingSpeed.y = -this.startingSpeed.y;
		else
			// console.log("nope y, this.pos = ", this.pos, " et this.canvasHeight = ", this.canvasHeight);
		this.pos = {
			x: this.pos.x + this.startingSpeed.x,
			y: this.pos.y + this.startingSpeed.y,
		}
	}
}

export default Ball;
