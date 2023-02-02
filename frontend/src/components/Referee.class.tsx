import React from 'react'
import Player from './Player.class';
import Ball from './Ball.class';

export enum GameState {

	/* someone won  OR  someone left  OR  forfeit */
	PermanentStop,

	/* waiting for the game to start at the beginning */
	WaitingForStart,

	/* the game is running */
	Running,

	/* waiting for the game to resume after a point */
	WaitingForResume,

	/* the game is on pause */
	Pause,
}

class Referee {

	private _player_left?: Player;
	private _player_right?: Player;
	private _gamestate: GameState;

	constructor(
		players: [Player, Player],
		private _ball: Ball,
		private _maxGoals: number = 5
	) {
		this._gamestate = GameState.WaitingForStart
		try {
			this.playersSetter(players)
		}
		catch (e) {}
	}

	private playersSetter(players: [Player, Player]) {
		
		if (players[0] == players[1] || players[0].paddle == players[1].paddle)
			throw new Error("These two players paddle are the same")
		if (players[0].paddle.pos.x == players[1].paddle.pos.x)
			throw new Error("These two players paddle are in the same x axis")			
		else if (players[0].paddle.pos.x < players[1].paddle.pos.x)
		{
			this._player_left = players[0];
			this._player_right = players[1];
		}
		else
		{
			this._player_left = players[1];
			this._player_right = players[0];
		}
	}

	private set player_left(player_left: Player) {
		this._player_left = player_left
	}

	public get player_left(): Player {
		if (!this._player_left)
			throw new Error('The left player have not been set up')
		return this._player_left
	}

	private set player_right(player_right: Player) {
		this._player_right = player_right
	}

	public get player_right(): Player {
		if (!this._player_right)
			throw new Error('The right player have not been set up')
		return this._player_right
	}

	private set ball(ball: Ball) {
		this._ball = ball
	}
	
	public get ball(): Ball {
		if (!this._ball)
			throw new Error('The ball have not been set up')
		return this._ball
	}

	private set gamestate(gamestate: GameState) {
		this._gamestate = gamestate
	}
	
	public get gamestate(): GameState {
		if (!this._gamestate)
			throw new Error('The gamestate have not been set up')
		return this._gamestate
	}

	private set maxGoals(maxGoals: number) {
		this._maxGoals = maxGoals
	}
	
	public get maxGoals(): number {
		if (!this._maxGoals)
			throw new Error('The maxGoals have not been set up')
		return this._maxGoals
	}


	private isBehindPaddleLeft(): boolean {
		this.player_right.addOneGoal()
		return (
			this.ball.pos.x - this.ball.radius <
			this.player_left.paddle.pos.x + this.player_left.paddle.dimensions.width
		)
	}
	
	private isBehindPaddleRight(): boolean {
		this.player_left.addOneGoal()
		return (
			this.ball.pos.x + this.ball.radius > this.player_right.paddle.pos.x
		)
	}

	private isBallOutsideOfField(): boolean {
		return (this.isBehindPaddleLeft() || this.isBehindPaddleRight())
	}

	private isGameFinished(): boolean {
		return (this.player_left.nbGoals >= this.maxGoals || this.player_right.nbGoals >= this.maxGoals)
	}

	private startActivator() {
		if (this.player_left.ready && this.player_right.ready)
			this.gamestate = GameState.Running;
	}

	private stopActivator() {
		if (this.isBallOutsideOfField() && !this.isGameFinished())
			this.gamestate = GameState.WaitingForStart;
		else if (this.isBallOutsideOfField() && this.isGameFinished())
			this.gamestate = GameState.PermanentStop;
	}

	public referee() {
		if (this.gamestate == GameState.Running)
			this.stopActivator()
		else if (
			this.gamestate == GameState.WaitingForStart ||
			this.gamestate == GameState.WaitingForResume
		)
			this.startActivator()
	}

	//dans cette classe qu'on va gerer les scores des players
}

export default Referee;