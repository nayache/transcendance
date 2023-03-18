import { forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeInterval } from 'rxjs';
import { AppGateway, GameDto, PlayerDto } from 'src/chat/app.gateway';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Difficulty } from './game.controller';
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
        
    public get color() {
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
    
    public static randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    
    public static randomIntFrom2Intervals(interval1: [number, number], interval2: [number, number]): number {
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
//				console.log("this.startingSpeed.x dans if = ", this.startingSpeed.x);
				// console.log("this.pos.x - this.radius = ", this.pos.x - this.radius)
//				console.log("solidObject.pos.x = ", solidObject.pos.x);
				if (this.isInsideX(solidObject))
				{
					startingSpeed = { ...this.startingSpeed, x: -this.startingSpeed.x }
					if (this.startingSpeed.x < 0)
						this.pos.x = solidObject.pos.x + solidObject.dimensions.width + this.radius;
					else if (this.startingSpeed.x > 0)
					{
//						console.log("this.pos.x dans le iffffffffffffffffffffffff tu connais = ", this.pos.x)
						this.pos.x = solidObject.pos.x - this.radius;
//						console.log("this.pos.x dans le iffffffffffffffffffffffff tu connais apres = ", this.pos.x)
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
//      console.log("this.startingSpeed.x a l'exterieur du if = ", this.startingSpeed.x, " et this.pos = ", this.pos);
		if (this.pos.y - this.radius < 0 || this.pos.y + this.radius > this.canvasHeight)
			this.startingSpeed.y = -this.startingSpeed.y;
		else {
			//console.log("nope y, this.pos = ", this.pos, " et this.canvasHeight = ", this.canvasHeight);
        }
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
        private _userId: string
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

    private set userId(userId: string) {
        this._userId = userId
    }
    
    public get userId(): string {
        if (!this._userId)
            throw new Error('The userId have not been set up')
        return this._userId
    }
    
    public addOneGoal() {
        console.log('nbGoal before', this._nbGoals);
        this.nbGoals++;
        console.log('nbGoal after', this._nbGoals);
    }
}

const PADDLE_WIDTH: number = 20;
const PADDLE_XSPACE: number = 10;


export class Paddle extends CanvasObject {

    constructor(    
        private _player?: Player,
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
        this._player = player;
    }
    
    public get player(): Player {
        if (!this._player)
            throw new Error('The player have not been set up');
        return this._player;
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
		else if (this.isGameFinished())
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
    id: string;
    w: number;
    h: number;
    y: number;
    user1: PlayerDto;
    user2: PlayerDto;
    player1: Player
    player2: Player;
    ball: Ball
    referee: Referee;
    score: [number, number];
    reqAnim: number;

    constructor(id: string, user1: PlayerDto, user2: PlayerDto, ss: Vector2D, width: number, height: number, y: number) {
        this.id = id
        this.user1 = user1;
        this.user2 = user2;
        this.player1 = new Player(PlayerSide.Left, new Paddle(undefined, 110, 'blue', width / 6, height, y), user1.id);
        this.player2 = new Player(PlayerSide.Right, new Paddle(undefined, 110, 'red', width / 6, height, y), user2.id);
        this.ball = new Ball(15, 'black', width, height, y);
        this.referee = new Referee([this.player1, this.player2], this.ball, 10);
        this.score = [0, 0];
        this.w = width;
        this.h = height;
        this.y = y;
        this.setUpGame(ss, width, height, y);
    }

    setUpGame(startingSpeed: Vector2D, canvasWidth: number, canvasHeight: number, canvasPosY: number) {
		this.player1.paddle.setUp(canvasWidth, canvasHeight, canvasPosY);
		this.player2.paddle.setUp(canvasWidth, canvasHeight, canvasPosY);
		this.ball.setUp(canvasWidth, canvasHeight, canvasPosY, startingSpeed);
		//on va set 2 boutons qui vont permettre de mettre respectivement les 2 joueurs prets a jouer,
		// quand les 2 joueurs sont prets, ca demarre
		// if (player1.isReadyToPlay && player2.isReadyToPlay || true)
	}
    
    updateGame() {
        this.ball.updatePos([this.player1.paddle, this.player2.paddle]);
    }

}

export class Challenge {
    author: string;
    invited: string;
    difficulty: Difficulty;

    constructor(author: string, invited: string, difficulty: Difficulty) {
        this.author = author;
        this.invited = invited;
        this.difficulty = difficulty;
    }
}

export class MoveObject {
    userId: string = null;
    pos: Point;
    dimensions: Dimensions;
    color: string;
    constructor(paddle: Paddle = null, ball: Ball = null, id: string = null) {
        if (id)
            this.userId = id;
        this.pos = (paddle) ? paddle.pos : ball.pos;
        this.dimensions = (paddle) ? paddle.dimensions : ball.dimensions;
        this.color = (paddle) ? paddle.color : ball.color;
    }
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(forwardRef(() => AppGateway)) private readonly appGateway: AppGateway) {
        this.matchmaking = new Map<Difficulty, Set<string>>();
        this.matchmaking.set(Difficulty.EASY, new Set<string>());
        this.matchmaking.set(Difficulty.MEDIUM, new Set<string>());
        this.matchmaking.set(Difficulty.HARD, new Set<string>());
        this.games = new Map<string, Game>();
        this.matchs = new Set<[string, string]>();
        this.speeds = new Map<string, Vector2D>();
        this.challenges = [];
    }
                    // gameID  //   viewer  DESSIN  
    //private games: Map<string, Map<string, Game> >; //concept
    private games: Map<string, Game>; //concept
    private speeds: Map<string, Vector2D>;
    private matchmaking: Map<Difficulty, Set<string> >;
    private challenges: Challenge[];
    private matchs: Set<[string, string]>;
    private logger: Logger = new Logger("GAME");

    addStartingSpeed(gameId: string): Vector2D {
       // if (!this.speeds.get(gameId)) {
            const startingSpeed = {
                x: CanvasObject.randomIntFrom2Intervals([-5, -3], [3, 5]),
                y: CanvasObject.randomIntFrom2Intervals([-5, -3], [3, 5])
            }
         //   this.speeds.set(gameId, startingSpeed);
        //return this.speeds.get(gameId);
        return startingSpeed;
    }

    async buildGame(payload: GameDto, userId: string, width: number, height: number, y: number): Promise<Game> {
        const game: Game = new Game(payload.id, payload.player1, payload.player2, this.addStartingSpeed(payload.id), width, height, y);
        if (!this.games.has(payload.id))
            this.games.set(payload.id, game);
        return game;
    }

    updateGame(game: Game, width: number, height: number, y: number/*, gameInfos: GameDto*/) {
        if (game.referee.gamestate == GameState.WaitingForStart)
        {
            this.logger.log(`WAITING FOR START`)
            try {
                game.setUpGame(this.addStartingSpeed(game.id), width, height, y)
            } catch (e) {
                console.log('ERROR: setupgame :', e);
            }
        }
        if (game.referee.gamestate == GameState.Running) {
            game.updateGame();
            const ball: MoveObject = new MoveObject(null, game.ball);
            const left: MoveObject = new MoveObject(game.player1.paddle, null, game.player1.userId);
            const right: MoveObject = new MoveObject(game.player2.paddle, null, game.player2.userId);
            this.appGateway.updateGame(game.id, left, right, ball);
        }
        if (game.referee.gamestate === GameState.WaitingForResume)
                this.logger.log(`WAITING FOR RESUME`)
        if (game.referee.gamestate === GameState.PermanentStop)
                this.logger.log(`PERMANENT STOP`)
        if (game.referee.gamestate === GameState.Pause)
                this.logger.log(`PAUSE`)
        try {
            const oldScore: [number, number] = [game.player1.nbGoals, game.player2.nbGoals];
            game.referee.referee();
            const newScore: [number, number] = [game.player1.nbGoals, game.player2.nbGoals];
            if (oldScore[0] !== newScore[0] || oldScore[1] !== newScore[1]) {
                const user: PlayerDto = (oldScore[0] != game.score[0]) ? game.user2 : game.user2;
                this.logger.log(`SCORE !! by (${user.pseudo})  score now: ${newScore}`)
                this.appGateway.updateScore(game.id, newScore);
            }
        } catch (e) {
            console.log('ERROR: ', e);
        }
       // game.reqAnim = requestAnimationFrame(() => this.gameLoop(game, width, height, y))
    }

    run(game: Game) {
        //-------------------> CONDITION ADRRET
        const intervalId: NodeJS.Timer = setInterval(() => {
            this.updateGame(game, game.w, game.h, game.y)
            if (game.referee.gamestate === GameState.PermanentStop)
                clearInterval(intervalId);
        }, 16);
    }

    getObjectsPositions(games: Map<string, Game>) {
        for (let game of games.values()) {

        }
    }

    setReady(game: Game, userId: string) {
        if (userId === game.player1.userId)
            game.player1.ready = true;
        else
           game.player2.ready = true;
    }

    async setReadyGame(gameInfos: GameDto, viewer: string, width: number, height: number, y: number) {
        // a verif !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let game: Game = this.games.get(gameInfos.id);
        if (game) {
            this.setReady(game, viewer);
            const ball: MoveObject = new MoveObject(null, game.ball);
            const left: MoveObject = new MoveObject(game.player1.paddle, null, game.player1.userId);
            const right: MoveObject = new MoveObject(game.player2.paddle, null, game.player2.userId);
            this.appGateway.preStartGameEvent(gameInfos.player1.id, gameInfos.player2.id, left, right, ball);
            this.run(game);
        } else {
            game = await this.buildGame(gameInfos, viewer, width, height, y);
            this.setReady(game, viewer);
        }
    }

    //===============EVENTS GAMEEEE==================================
    //===============================================================

    async paddleMove(author: string, gameId: string, e: MouseEvent) {
        const game: Game = this.games.get(gameId);
        if (!game)
            return this.logger.error('game not found')
        //let moves: MoveObject[];
        const emitter: Player = (game.user1.id === author) ? game.player1 : game.player2;
        emitter.paddle.onMouseMove(e);
        //moves.push(new MoveObject(emitter.paddle, null, emitter.userId));
    }


    //==============================================================
    //==============================================================
    
    async createGame(user1: string, user2: string, difficulty: Difficulty, ranked: boolean = true): Promise<GameEntity> {
        const player1: UserEntity = await this.userService.findById(user1);
        const player2: UserEntity = await this.userService.findById(user2);
        if (!player1 || !player2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND);
        try {
            const game: GameEntity = await this.gameRepository.save(new GameEntity(player1, player2, difficulty, ranked));
            this.matchs.add([user1, user2]);
            return game;
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }
    
    async updateEndingGame(gameId: string, forfeit: string = null) {
        if (forfeit) {
            await this.setForfeit(gameId);
            await this.updateForfeitScore(gameId, forfeit);
        }
        await this.updateResults(gameId, forfeit);
        return this.findGameById(gameId);
    }

    async endGame(gameId: string, forfeit: string = null) {
        const game = this.games.get(gameId);
        const gameData: GameEntity = await this.updateEndingGame(gameId, forfeit);
        const gameInfo: GameDto = await this.gameToDto(gameData);
        if (game)
            console.log('endgames, game');
        else {
            console.log('endgames nogames!!!!!!! ');
            return
        }
        this.appGateway.endGameEvent(gameInfo.player1.id, gameInfo.player2.id, gameInfo); // socket event avertir fin game
    }

    createChallenge(author: string, invited: string, difficulty: Difficulty) {
        this.challenges.push(new Challenge(author, invited, difficulty));
    }

    deleteChallenges(authorId: string) {
        console.log('before filter', this.challenges)
        this.challenges = this.challenges.filter((challenge) => challenge.author !== authorId);
        console.log('after filter', this.challenges)
    }

    findChallenge(author: string, invited: string): Challenge {
        for (let challenge of this.challenges.values()) {
            if (challenge.author === author && challenge.invited === invited)
                return challenge;
        }
        return null;
    }

    deleteChallenge(challenge: Challenge) {
        const i: number = this.challenges.indexOf(challenge);
        if (i != -1)
            this.challenges.splice(i, 1);
    }

    async startChallenge(challenge: Challenge): Promise<GameEntity> {
        this.deleteChallenge(challenge);
        return this.createGame(challenge.author, challenge.invited, challenge.difficulty, false);
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
        let difficulty: Difficulty = null;
        if (this.matchmaking.get(Difficulty.EASY).delete(userId))
            difficulty = Difficulty.EASY
        if (this.matchmaking.get(Difficulty.MEDIUM).delete(userId))
            difficulty = Difficulty.EASY
        if (this.matchmaking.get(Difficulty.HARD).delete(userId))
            difficulty = Difficulty.HARD
        const pseudo: string = await this.userService.getPseudoById(userId);
        //////
        if (difficulty)
            this.logger.warn(`Player is removed to matchmaking in [${difficulty}] mode (${pseudo})`)
    }

    async removeMatch(userId: string) {
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

    async getPlayerDto(userId: string): Promise<PlayerDto> {
        const pseudo: string = await this.userService.getPseudoById(userId);
        return {id: userId, pseudo};
    }

    async gameToDto(game: GameEntity): Promise<GameDto> {
        const id: string = game.id;
        const ranked: boolean = game.ranked;
        const difficulty: Difficulty = game.Difficulty;
        const player1: PlayerDto = await this.getPlayerDto(game.player1Id);
        const player2: PlayerDto = await this.getPlayerDto(game.player2Id);
        const score1: number = game.score1;
        const score2: number = game.score2;
        const forfeit: boolean = game.forfeit;
        const xp1: number = game.xp1;
        const xp2: number = game.xp2;
        const date: Date = game.created_at;
        return { id, ranked, difficulty, player1, player2, score1, score2, forfeit, xp1, xp2, date };
    }

    async getLastGame(userId: string): Promise<GameEntity> {
        if (!this.isInGame(userId))
            return null;
        const opponentId: string = this.getOpponent(userId);
        const game: GameEntity = await this.gameRepository.findOne({where: [
                {player1Id: userId, player2Id: opponentId},
                {player1Id: opponentId, player2Id: userId}
            ], order: { created_at: "DESC" }
        });
        return game;
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

    async searchOpponent(userId: string, difficulty: Difficulty): Promise<GameEntity> {
        const opponentId: string = this.findOpponent(userId, difficulty);
        if (!opponentId)
            this.addPlayer(userId, difficulty);
        else {
            const game: GameEntity = await this.createGame(userId, opponentId, difficulty);
            console.log(this.matchmaking) ////log a SUPP
            return game;
        }
        return null;
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

    calculXp(winner: boolean, difficulty: Difficulty, scoredGoal: number, concededGoal: number): number {
        console.log(difficulty, scoredGoal, concededGoal)
        const finishGameXp: number = 50;
        const difficultyBonus: number = (difficulty === Difficulty.HARD) ? 50 : ((difficulty === Difficulty.MEDIUM) ? 30 : 10);
        console.log('dbonus:', scoredGoal, difficultyBonus);
        const goalAverage: number = (scoredGoal * difficultyBonus) - (concededGoal * 5);
        console.log('GA:', goalAverage);
        const totalXp: number = (finishGameXp + goalAverage);
        return (winner) ? (totalXp * 2) : totalXp;
    }

    async updateResults(gameId: string, disconnected: string) {
        const game: GameEntity = await this.findGameById(gameId);
        if (!game)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.GAME, TypeErr.NOT_FOUND);
        if (!game.ranked)
            return;
        const looser: string = (disconnected) ? disconnected : ((game.score1 < game.score2) ? game.player1Id : game.player2Id);
        const winner: string = (looser === game.player1Id) ? game.player2Id : game.player1Id;
        const scoreMax: number = (game.score1 > game.score2) ? game.score1 : game.score2;
        const scoreMin: number = (scoreMax === game.score1) ? game.score2 : game.score1;
        const looserXp: number = (disconnected) ? 0 : this.calculXp(false, game.Difficulty, scoreMin, scoreMax);
        const winnerXp: number = (game.forfeit) ? this.calculXp(true, game.Difficulty, 1, 0) : this.calculXp(true, game.Difficulty, scoreMax, scoreMin);
        await this.updateGameXp(game, winner, winnerXp, looserXp);
        await this.userService.updateXp(winner, winnerXp);
        if (!disconnected)
            await this.userService.updateXp(looser, looserXp);
        await this.userService.updateResults(winner, true);
        await this.userService.updateResults(looser, false);
        if (!disconnected) {
            await this.userService.updateAchievements(winner, true, !!scoreMin);
            await this.userService.updateAchievements(looser, false, false);
        }
        return { winner, looser, winnerXp, looserXp }; ///// ????????????????
    }

    ///===============GAME DATABASES-UPDATES=======================
    ///==================================================

    async findGameById(id: string): Promise<GameEntity> {
        return this.gameRepository.findOneBy({id: id});
    }

    async updateGameXp(game: GameEntity, winner: string, winnerXp: number, looserXp: number) {
        try {
            if (game.player1Id === winner) {
                await this.gameRepository.update(game.id, { xp1: winnerXp });
                await this.gameRepository.update(game.id, { xp2: looserXp });
            } else {
                await this.gameRepository.update(game.id, { xp1: looserXp });
                await this.gameRepository.update(game.id, { xp2: winnerXp });
            }
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    async updateForfeitScore(gameId: string, disconnected: string) {
        try {
            const game: GameEntity = await this.findGameById(gameId);
            if (game.player1Id === disconnected) {
                await this.gameRepository.update(game.id, { score1: 0 });
                await this.gameRepository.update(game.id, { score2: 42 });
            }
            else {
                await this.gameRepository.update(game.id, { score1: 42 });
                await this.gameRepository.update(game.id, { score2: 0 });
            }
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    async scoreGoal(id: string, playerId: string) {
        const game: GameEntity = await this.findGameById(id);
        if (!game)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.DATABASE, TypeErr.NOT_FOUND);
        try {
            if (game.player1Id === playerId)
                await this.gameRepository.update(id, { score1: game.score1 + 1 })
            else
                await this.gameRepository.update(id, { score2: game.score2 + 1 })
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    async setForfeit(gameId: string) {
        try {
            await this.gameRepository.update(gameId, { forfeit: true });
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    async getHistory(userId: string): Promise<GameDto[]> {
        try {
            const games: GameEntity[] = await this.gameRepository.find({where: [
                {player1Id: userId}, {player2Id: userId}
            ]});
            return await Promise.all(games.map(async (game) => await this.gameToDto(game)));
        } catch(e) {
            return null;
        }
    }

    ///==================================================
    ///==================================================
}