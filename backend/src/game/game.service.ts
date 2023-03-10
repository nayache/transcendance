import { forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Difficulty, Match } from './game.controller';
import { GameEntity } from './game.entity';

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
    
abstract class CanvasObject {
    
    private _startingSpeed?: Vector2D;
    
    constructor(
        private _dimensions?: Dimensions,
        private _pos?: Point,
        private _color?: string,
        private _canvasWidth?: number,
        private _canvasHeight?: number,
        private _canvasPosY?: number) {
            console.log("CanvasObject creation")
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
        
    public get startingSpeed() {
        if (!this._startingSpeed)
            throw new Error('The startingSpeed have not been set up')
        return this._startingSpeed;
    }
    
    protected set startingSpeed(startingSpeed: Vector2D) {
        this._startingSpeed = startingSpeed;
    }
    
    protected setUp(canvasWidth: number, canvasHeight: number, canvasPosY?: number): void {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        if (canvasPosY)
            this.canvasPosY = canvasPosY;
    }
    
    protected static isBetween<T>(myItem: T, limitInf: T, limitSup: T, inclusive: boolean = true): boolean {
        if (!inclusive)
            return (myItem > limitInf && myItem < limitSup)
        return (myItem >= limitInf && myItem <= limitSup)
    }
    
    protected static randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    
    protected static randomIntFrom2Intervals(interval1: [number, number], interval2: [number, number]): number {
        if (Math.random() > 0.5)
            return CanvasObject.randomIntFromInterval(interval1[0], interval1[1])
        else
            return CanvasObject.randomIntFromInterval(interval2[0], interval2[1])
    }
    
    public isInsideX(solidObject: CanvasObject): boolean {
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
    

}

export class Ball extends CanvasObject {

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
				console.log("this.startingSpeed.x dans if = ", this.startingSpeed.x);
				// console.log("this.pos.x - this.radius = ", this.pos.x - this.radius)
				console.log("solidObject.pos.x = ", solidObject.pos.x);
				if (this.isInsideX(solidObject))
				{
					startingSpeed = { ...this.startingSpeed, x: -this.startingSpeed.x }
					if (this.startingSpeed.x < 0)
						this.pos.x = solidObject.pos.x + solidObject.dimensions.width + this.radius;
					else if (this.startingSpeed.x > 0)
					{
						console.log("this.pos.x dans le iffffffffffffffffffffffff tu connais = ", this.pos.x)
						this.pos.x = solidObject.pos.x - this.radius;
						console.log("this.pos.x dans le iffffffffffffffffffffffff tu connais apres = ", this.pos.x)
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
					console.log("sideTouched = ", a.get(sideTouched))
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
		console.log("this.startingSpeed.x a l'exterieur du if = ", this.startingSpeed.x, " et this.pos = ", this.pos);
		if (this.pos.y - this.radius < 0 || this.pos.y + this.radius > this.canvasHeight)
			this.startingSpeed.y = -this.startingSpeed.y;
		else
			console.log("nope y, this.pos = ", this.pos, " et this.canvasHeight = ", this.canvasHeight);
		this.pos = {
			x: this.pos.x + this.startingSpeed.x,
			y: this.pos.y + this.startingSpeed.y,
		}
	}
}

export enum PlayerSide {
    Left = 1,
    Right
}

export class Player {

    private _nbGoals: number;
    private _ready: boolean;

    constructor(
        private _playerSide: PlayerSide,
        private _paddle: Paddle,
    ) {
        this._paddle.bindToplayer(this)
        this._nbGoals = 0;
        this._ready = false;
    }


    public get paddle(): Paddle {
        return this._paddle;
    }

    public get nbGoals(): number {
        return this._nbGoals;
    }
    
    private set nbGoals(nbGoals : number) {
        this._nbGoals = nbGoals;
    }

    public get playerSide(): PlayerSide {
        return this._playerSide;
    }
    
    public get ready(): boolean {
        return this._ready;
    }
    
    public set ready(ready: boolean) {
        this._ready = ready;
    }


    public addOneGoal() {
        this.nbGoals++;
    }
}

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;


export class Paddle extends CanvasObject {

    constructor(    
     //   private _player?: Player,
        height: number = 100,
        color: string = 'black',
        canvasWidth?: number,
        canvasHeight?: number,
        canvasPosY?: number,
    ) {
        super(
            { width: PADDLE_WIDTH, height },
            undefined,
            color,
            canvasWidth,
            canvasHeight,
            canvasPosY,
        );
    }

    public bindToplayer(player: Player) {
//        this._player = player;
    }
    
    public get player(): Player {
  //      if (!this._player)
            throw new Error('The player have not been set up');
    //    return this._player;
    }


    onMouseMove(e: MouseEvent): void {
        try {
            this.pos.y = e.clientY - this.canvasPosY - this.dimensions.height / 2;
        } catch (err) {
        }
    }

    setUp(
        canvasWidth: number,
        canvasHeight: number,
        canvasPosY?: number
    ): void {
        let y: number;

        super.setUp(canvasWidth, canvasHeight, canvasPosY);
        try {
            y = this.pos.y;
        } catch (err) {
            y = canvasHeight / 2 - this.dimensions.height / 2
        }
        if (this.player.playerSide == PlayerSide.Right && this.canvasWidth)
            this.pos = { x: this.canvasWidth - this.dimensions.width - PADDLE_XSPACE, y }
        else
            this.pos = { x: PADDLE_XSPACE, y }
    }

}


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

export class Referee {

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
		
		if (players[0].playerSide == players[1].playerSide)
			throw new Error("These two players are in the same sides");
		this._player_left = players[0].playerSide == PlayerSide.Left ? players[0] : players[1];
		this._player_right = players[0].playerSide == PlayerSide.Right ? players[0] : players[1];
		/*
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
		*/
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

		const isBehindPaddleLeft: boolean = 
			this.ball.pos.x + this.ball.radius <
			this.player_left.paddle.pos.x
		if (isBehindPaddleLeft)
			this.player_right.addOneGoal();
		return isBehindPaddleLeft;
	}
	
	private isBehindPaddleRight(): boolean {

		const isBehindPaddleRight: boolean = 
			this.ball.pos.x - this.ball.radius > this.player_right.paddle.pos.x
			+ this.player_right.paddle.dimensions.width
		if (isBehindPaddleRight)
			this.player_left.addOneGoal();
		return isBehindPaddleRight;
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

export class Game {
    player1ID: string;
    player2ID: string;
    player1: Player
    player2: Player;
    ball: Ball
    referee: Referee;
    score: [number, number];

    constructor(userId1: string, userId2: string, width: number, height: number, y: number) {
        this.player1ID = userId1;
        this.player2ID = userId2;
        this.player1 = new Player(PlayerSide.Left, new Paddle(110, 'blue', width, height, y));
        this.player2 = new Player(PlayerSide.Right, new Paddle(110, 'red', width, height, y));
        this.ball = new Ball(10, 'grey', width, height, y);
        this.referee = new Referee([this.player1, this.player2], this.ball, 3);
        this.score = [0, 0];
    }
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>,
        @Inject(forwardRef(() => UserService)) private userService: UserService) {
        this.matchmaking = new Map<Difficulty, Set<string>>();
        this.matchmaking.set(Difficulty.EASY, new Set<string>());
        this.matchmaking.set(Difficulty.MEDIUM, new Set<string>());
        this.matchmaking.set(Difficulty.HARD, new Set<string>());
        this.games = new Map<[string, string], Map<string, Game>>();
        this.matchs = new Set<[string, string]>();
    }

    private games: Map<[string, string], Map<string, Game> >;
    private matchmaking: Map<Difficulty, Set<string> >;
    private matchs: Set<[string, string]>;
    private logger: Logger = new Logger("GAME");

    async buildGame(userId1: string, userId2: string, viewer: string, width: number, height: number, y: number) {
        const game: Game = new Game(userId1, userId2, width, height, y);
        if (!this.games.has([userId1, userId2]))
            this.games.set([userId1, userId2], new Map<string, Game>().set(viewer, game));
        else
            this.games.get([userId1, userId2]).set(viewer, game);
    }

    async createGame(user1: string, user2: string, difficulty: Difficulty): Promise<GameEntity> {
        const player1: UserEntity = await this.userService.findById(user1);
        const player2: UserEntity = await this.userService.findById(user2);
        if (!player1 || !player2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND);
        try {
            const game: GameEntity = await this.gameRepository.save(new GameEntity(player1, player2, difficulty));
            this.matchs.add([user1, user2]);
            return game;
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    isInMatchmaking(userId: string): boolean {
        if (this.matchmaking.get(Difficulty.EASY).has(userId))
            return true;
        if (this.matchmaking.get(Difficulty.MEDIUM).has(userId))
            return true;
        if (this.matchmaking.get(Difficulty.HARD).has(userId))
            return true;
        return false;
    }

    async removePlayerFromMatchmaking(userId: string) {
        let difficulty: Difficulty;
        if (this.matchmaking.get(Difficulty.EASY).delete(userId))
            difficulty = Difficulty.EASY
        if (this.matchmaking.get(Difficulty.MEDIUM).delete(userId))
            difficulty = Difficulty.EASY
        if (this.matchmaking.get(Difficulty.HARD).delete(userId))
            difficulty = Difficulty.HARD
        const pseudo: string = await this.userService.getPseudoById(userId);
        //////
        this.logger.warn(`Player is removed to matchmaking in [${difficulty}] mode (${pseudo})`)
    }

    async removeGame(userId: string) {
        console.log('matchs:', this.matchs);
        for (const players of this.matchs.values()) {
            if (players[0] === userId || players[1] === userId) {
                const p1: string = await this.userService.getPseudoById(players[0])
                const p2: string = await this.userService.getPseudoById(players[1])
                this.logger.log(`match has been ending beetwen (${p1} vs ${p2})`);
                this.matchs.delete(players);
                console.log('matchs after delete:', this.matchs);
                return
            }
        }
    }

    isInGame(userId: string): boolean {
        for (const players of this.matchs.values()) {
            if (players[0] === userId || players[1] === userId)
                return true;
        }
        return false;
    }

    async addPlayer(userId: string, difficulty: Difficulty) {
        this.matchmaking.get(difficulty).add(userId);
        ////for LOGGGG
        const pseudo: string = await this.userService.getPseudoById(userId);
        //////
        this.logger.log(`Player is added to matchmaking in [${difficulty}] mode (${pseudo})`)
    }

    getOpponent(userId: string): string {
        for (const players of this.matchs.values()) {
            if (players[0] === userId || players[1] === userId)
                return (players[0] === userId) ? players[1] : players[0];
        }
        return null;
    }

    async searchOpponent(userId: string, difficulty: Difficulty): Promise<any> {
        const opponentId: string = this.findOpponent(userId, difficulty);
        if (!opponentId)
            this.addPlayer(userId, difficulty);
        else {
            const game: GameEntity = await this.createGame(userId, opponentId, difficulty);
            console.log(this.matchmaking) ////log a SUPP
            return { id: game.id, player1: userId, player2: opponentId };
        }
        return { id: null };
    }

    findOpponent(userId: string, difficulty: Difficulty): string {
        const matchmaking: Set<string> = this.matchmaking.get(difficulty);
        for (const player of matchmaking.values()) {
            if (player !== userId) {
                this.matchmaking.get(difficulty).delete(player);
                this.matchmaking.get(difficulty).delete(userId);
                return player;
            }
        }
        return null;
    }
}