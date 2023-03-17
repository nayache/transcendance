import { Container } from '../styles/Playground.style'
import Canvas from './Canvas'
import PaddleDisplayer from './PaddleDisplayer.class'
import BallDisplayer from './BallDisplayer.class'
import RefereeDisplayer from './RefereeDisplayer.class'
// import DrawerDisplayer from './DrawerDisplayer.class'
import PlayerDisplayer, { PlayerSide } from './PlayerDisplayer.class'
import DrawerDisplayer from './DrawerDisplayer.class'
import { Socket } from 'socket.io-client'
import { GameDto } from '../interface/IGame'
import { useState } from 'react'

const MAX_GOALS: number = 4;

interface Props {
	socket: Socket;
	infos: GameDto;
}

interface CanvasDimensions {
	width: number,
	height: number;
	y: number
}

const Playground = ({ socket, infos }: Props) => {

	const [dimensions, setDimensions] = useState<CanvasDimensions>();

	const paddle_left: PaddleDisplayer = new PaddleDisplayer(
		undefined,
		110,
		"blue"
	)
	const player_left: PlayerDisplayer = new PlayerDisplayer(PlayerSide.Left, paddle_left)
	const paddle_right: PaddleDisplayer = new PaddleDisplayer(
		undefined,
		110,
		"red"
	)
	const player_right: PlayerDisplayer = new PlayerDisplayer(PlayerSide.Right, paddle_right)
	const ball: BallDisplayer = new BallDisplayer(
		50,
		"grey",
	)
	const ref: RefereeDisplayer = new RefereeDisplayer(
		[player_left, player_right],
		ball,
		MAX_GOALS
	)
	const drawer: DrawerDisplayer = new DrawerDisplayer(ref)

	return (
		<Container>
			{/* {isCanvasReady([playgroundWidth, playgroundHeight]) &&
			<Canvas display={gameLoop} id="playground"
			width={playgroundWidth} height={playgroundHeight} />} */}
			<Canvas
			onInit={(context, canvasWidth, canvasHeight, canvas) => 
				setDimensions({width: canvasWidth, height: canvasHeight, y: canvas.getBoundingClientRect().top})}
			display={(context, canvasWidth, canvasHeight, canvas) => 
				drawer.gameLoop(context, canvasWidth, canvasHeight, canvas)} id="playground" />
			<button onClick={() => {
				if (dimensions != undefined)
					socket.emit('buildGame', {infos, });
			}}>Start</button>
		</Container>
	)
};

export default Playground;