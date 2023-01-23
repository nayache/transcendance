import React, { useState, useRef, useEffect } from "react"
import { Container } from '../Styles/Playground.style'
import Canvas from './Canvas'
import { drawBgnd, clearBgnd, setUpGame } from "../Functions/Draw_utils.func"
import Paddle from "./Paddle.class"
import Ball from "./Ball.class"
import Referee from "./Referee.class"

interface Props {
}


export class Player { // temporary

	constructor (
		public isReadyToPlay: boolean = false
	) {

	}
}

export enum GameState {
	Stop,
	Start,
	Pause,
	Reset,
}

const Playground = () => {

	const playgroundRef = useRef<HTMLDivElement>(null);
	const [playgroundWidth, setPlaygroundWidth] = useState<number>(0);
	const [playgroundHeight, setPlaygroundHeight] = useState<number>(0);
	// const player: Player;
	const paddle: Paddle = new Paddle(
		1,
		110,
		'blue'
	);
	const paddle2: Paddle = new Paddle(
		2,
		110,
		'red'
	);
	const player1: Player = new Player(
		false
	);
	const player2: Player = new Player(
		false
	);
	const ball: Ball = new Ball(
		10,
		'grey'
	)
	const ref: Referee = new Referee();
	let gamestate = GameState.Reset;
	let reqAnim: number;

	useEffect(() => {
		const playground = playgroundRef.current;
		if (!playground)
			return ;
		console.log('playgroundWidth = ', playgroundWidth)
		setPlaygroundWidth(playground.clientWidth - 10);
		setPlaygroundHeight(playground.clientHeight - 10);
		console.log('playgroundHeight = ', playgroundHeight)
	}, [playgroundWidth, playgroundHeight])

	const isCanvasReady = (canvasDimensions: [number, number]) => {
		//on affiche le canvas seulement quand :
		if (playgroundWidth && playgroundHeight) //_ ses dimensions sont pretes (pcq sinon il faut clear le canvas puis refaire c'est un peu chiant)
			return (true);
		return (false);
	}

	const gameLoop = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvas: HTMLCanvasElement) => {
		if (gamestate == GameState.Reset)
		// setUpGame({ player1, player2, paddle, paddle2, ball, context, canvas, canvasWidth, canvasHeight, gamestate })
		{
			paddle.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
			paddle2.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
			ball.setUp(context, canvasWidth, canvasHeight, undefined, { x: -2, y: 2 });
			gamestate = GameState.Start;
		}
		if (gamestate == GameState.Start)
		{
			clearBgnd(context, canvasWidth, canvasHeight);
			drawBgnd(context, canvasWidth, canvasHeight);
			paddle.draw(canvas.getBoundingClientRect().top);
			paddle2.draw(canvas.getBoundingClientRect().top);
			ball.draw();
			ball.updatePos([paddle, paddle2]);
		}
		if (ref.isFinished([paddle, paddle2], ball))
		{
			console.log("it's finished")
			gamestate = GameState.Stop;
		}
		reqAnim = requestAnimationFrame(() => gameLoop(context, canvasWidth, canvasHeight, canvas))
		// console.log('reqAnim = ', reqAnim);
	}

	// console.log('isCanvasReady ? ', isCanvasReady([playgroundWidth, playgroundHeight]))

	return (
		<Container ref={playgroundRef}>
			{/* {isCanvasReady([playgroundWidth, playgroundHeight]) &&
			<Canvas draw={gameLoop} id="playground"
			width={playgroundWidth} height={playgroundHeight} />} */}
			<Canvas draw={gameLoop} id="playground" />
		</Container>
	)
};

export default Playground;