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
import '../styles/Playground.css'
import { useRef, useState } from 'react'
import { BtnStatus } from './Button'
import { useStartGameListener } from '../hooks/useStartGameListener'

const MAX_GOALS: number = 4;

interface Props {
	socket: Socket;
	infos: GameDto;
	leftPlayer: PlayerDisplayer,
	rightPlayer: PlayerDisplayer,
}

interface CanvasDimensions {
	width: number,
	height: number;
	y: number
}

const Playground = ({ socket, infos, leftPlayer, rightPlayer }: Props) => {

	const dimensions = useRef<CanvasDimensions>();
	const [startBtn, setStartBtn] = useState<BtnStatus>("idle")

	const ball: BallDisplayer = new BallDisplayer(
		socket,
		50,
		"grey",
	)
	const drawer: DrawerDisplayer = new DrawerDisplayer(
		leftPlayer,
		rightPlayer,
		ball
	)




	useStartGameListener(socket, leftPlayer, rightPlayer, ball)



	return (
		<div className="playground-container">
			<Container>
				{/* {isCanvasReady([playgroundWidth, playgroundHeight]) &&
				<Canvas display={gameLoop} id="playground"
				width={playgroundWidth} height={playgroundHeight} />} */}
				<Canvas
				onInit={(context, canvasWidth, canvasHeight, canvas) => 
					drawer.setUpGame(context, canvasWidth, canvasHeight, canvas)
				}
				display={(context, canvasWidth, canvasHeight, canvas) => 
					drawer.gameLoop(context, canvasWidth, canvasHeight, canvas)}
				id="playground" />
			</Container>
			{ startBtn === "idle" && 
				<div className="pulseBtn-wrap">
					<button className="pulseBtn-button" onClick={() => {
						console.log("dimensions.current = ", dimensions.current)
						console.log("drawer.isCanvasUtilsSet() = ", drawer.isCanvasUtilsSet())
						if (drawer.isCanvasUtilsSet())
							socket.emit('setReady', {
								game: infos,
								w: drawer.canvasWidth,
								h: drawer.canvasHeight,
								y: drawer.canvas.getBoundingClientRect().top
							});
						setStartBtn("loading")
					}}>Start</button>
				</div> ||

				startBtn === "loading" &&
				<div className="form-btn-container">
					<svg id="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
						<defs>
							<linearGradient id="spinner-gradient-a" x1="49.892%" x2="55.03%" y1="58.241%" y2="89.889%">
								<stop offset="0%"/>
								<stop offset="22.44%" stopOpacity=".59"/>
								<stop offset="100%" stopOpacity="0"/>
							</linearGradient>
						</defs>
						<g fill="none" transform="translate(-8 -8)">
							<path d="M32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 C56,45.254834 45.254834,56 32,56 Z M32,52 C43.045695,52 52,43.045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 Z"/>
							<path fill="url(#spinner-gradient-a)" d="M56,32 C56,33.1045695 55.1045695,34 54,34 C52.8954305,34 52,33.1045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 C33.1045695,52 34,52.8954305 34,54 C34,55.1045695 33.1045695,56 32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 Z" transform="rotate(45 32 32)"/>
						</g>
					</svg>
				</div>
			}
		</div>
	)
};

export default Playground;