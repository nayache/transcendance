import React from 'react'
import Paddle from './Paddle.class';
import Ball from './Ball.class';

class Referee {

	private _paddle_left?: Paddle;
	private _paddle_right?: Paddle;

	private paddlesSetter(paddles: [Paddle, Paddle]) {
		if (paddles[0] == paddles[1])
			throw new Error("These two paddles are the same")
		if (paddles[0].pos?.x && paddles[1].pos?.x)
			if (paddles[0].pos.x < paddles[1].pos.x)
			{
				this._paddle_left = paddles[0];
				this._paddle_right = paddles[1];
			}
			else
			{
				this._paddle_left = paddles[1];
				this._paddle_right = paddles[0];
			}
	}

	public get paddle_left(): Paddle | undefined {
		return this._paddle_left;
	}

	public get paddle_right(): Paddle | undefined {
		return this._paddle_right;
	}

	public isFinished(paddles: [Paddle, Paddle], ball: Ball): boolean {
		this.paddlesSetter(paddles);
		if (!this.paddle_left || !this._paddle_right || !this.paddle_left.isPosSetUp()
		|| !this._paddle_right.isPosSetUp() || !ball.isPosSetUp())
			return (false);
		console.log("test dans isFinished");
		if (ball.pos!.x! - ball.radius < this.paddle_left!.pos!.x! + this._paddle_left!.dimensions.width
		|| ball.pos!.x! + ball.radius > this._paddle_right!.pos!.x!)
			return (true);
		return (false);
	}
}

export default Referee;