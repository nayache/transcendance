import { GameState } from "../components/Playground";
import { Player } from "../components/Playground";
import Paddle from "../components/Paddle.class"
import Ball from "../components/Ball.class"

interface GameVariables {
	player1: Player,
	player2: Player,
	paddle: Paddle,
	paddle2: Paddle,
	ball: Ball,
	context: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	canvasWidth: number,
	canvasHeight: number,
	gamestate: GameState,

}

const drawMiddleLine = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
	const middleWidth = canvasWidth / 2;
	const lineWidth = canvasWidth / 100;

	context.beginPath();
	context.lineWidth = lineWidth;
	context.setLineDash([20, 15]);
	context.moveTo(middleWidth, 0);
	context.lineTo(middleWidth, canvasHeight);
	context.stroke();
}

export const drawBgnd = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	drawMiddleLine(context, canvasWidth, canvasHeight);
}

export const clearBgnd = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

export const setUpGame = ({ player1, player2, paddle, paddle2, ball, context, canvas, canvasWidth, canvasHeight, gamestate }: GameVariables) => {
	paddle.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
	paddle2.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
	ball.setUp(context, canvasWidth, canvasHeight);
	//on va set 2 boutons qui vont permettre de mettre respectivement les 2 joueurs prets a jouer,
	// quand les 2 joueurs sont prets, ca demarre
	// player1.isReadyToPlay = true;
	// player2.isReadyToPlay = true;
	// if (player1.isReadyToPlay && player2.isReadyToPlay || true)
		gamestate = GameState.Start;
}