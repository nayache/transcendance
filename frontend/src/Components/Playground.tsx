import React, { useState, useRef, useEffect } from "react"
import { Container } from '../Styles/Playground.style'
import Canvas from './Canvas'
import { drawBgnd, clearBgnd } from "../Functions/Draw_utils.func"
import Paddle from "./Paddle.class"

interface Props {
}

const Playground = () => {

	const playgroundRef = useRef<HTMLDivElement>(null);
	const [playgroundWidth, setPlaygroundWidth] = useState<number>(0);
	const [playgroundHeight, setPlaygroundHeight] = useState<number>(0);
	// const player: Player;
	const paddle: Paddle = new Paddle(
		1,
		10,
		110,
		'blue'
	);
	const paddle2: Paddle = new Paddle(
		2,
		100,
		110,
		'red'
	);
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

	const pauseDraw = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
		clearBgnd(context, canvasWidth, canvasHeight);
		drawBgnd(context, canvasWidth, canvasHeight);
	}

	const gameLoop = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvas: HTMLCanvasElement) => {
		clearBgnd(context, canvasWidth, canvasHeight);
		drawBgnd(context, canvasWidth, canvasHeight);
		if (paddle) {
			paddle.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
			paddle.draw();
		}
		if (paddle2 && paddle2.dimensions) {
			const width: number = paddle2.dimensions.width

			paddle2.setUp(context, canvasWidth, canvasHeight, canvas.getBoundingClientRect().top);
			paddle2.draw();
		}
		reqAnim = requestAnimationFrame(() => gameLoop(context, canvasWidth, canvasHeight, canvas))
		// console.log('reqAnim = ', reqAnim);
	}

	const stopGame = (reqAnim: number) => {
		cancelAnimationFrame(reqAnim);
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