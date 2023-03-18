import React from 'react'
import { Socket } from 'socket.io-client';
import { GameDto, MoveObject } from '../interface/IGame';
import CanvasObjectDisplayer, { Point, Dimensions, Vector2D, Side } from './CanvasObjectDisplayer.class';

class BallDisplayer extends CanvasObjectDisplayer {

	constructor(
		socket: Socket,
		radius: number = 10,
		color: string = 'grey',
		gameInfos?: GameDto,
		canvas?: HTMLCanvasElement,
		context?: CanvasRenderingContext2D,
		canvasWidth?: number,
		canvasHeight?: number,
		canvasPosY?: number,
	) {
		super(
			socket,
			gameInfos,
			{ width: radius, height: radius },
			undefined,
			color,
			canvas,
			context,
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


	public setUp(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		canvasPosY?: number,
		moveObject?: MoveObject,
	): void {
		super.setUp(canvas, ctx, canvasWidth, canvasHeight, canvasPosY, moveObject);
		this.pos = { x: canvasWidth / 2, y: canvasHeight / 2 }
		super.display(moveObject);
		this.context.arc(
			this.pos.x,
			this.pos.y,
			this.radius,
			0,
			2 * Math.PI
		)
		this.context.fill();
		//set une vitesse ou un bail comme ca
	}

	display(moveObject?: MoveObject): void {
		super.display(moveObject);
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

export default BallDisplayer;