import { Container } from '../styles/Playground.style'
import Canvas from './Canvas'
import PaddleDisplayer from './PaddleDisplayer.class'
import BallDisplayer from './BallDisplayer.class'
import RefereeDisplayer from './RefereeDisplayer.class'
// import DrawerDisplayer from './DrawerDisplayer.class'
import PlayerDisplayer, { PlayerSide } from './PlayerDisplayer.class'
import DrawerDisplayer from './DrawerDisplayer.class'
import { Socket } from 'socket.io-client'
import { Difficulty, GameDto, MoveObjects } from '../interface/IGame'
import '../styles/Playground.css'
import '../styles/Game.css'
import { useEffect, useRef, useState } from 'react'
import { BtnStatus } from './Button'
import { useStartGameListener } from '../hooks/useStartGameListener'
import { useUpdateGameListener } from '../hooks/useUpdateGameListener'
import { useUpdateScoreListener } from '../hooks/useUpdateScoreListener'
import { useEndGameListener } from '../hooks/useEndGameListener'
import ModalGameStatMenu, { ModalGameStatType } from './ModalGameStatMenu'
import ClientApi from './ClientApi.class'
import { BASE_URL } from '../constants/RoutesApi'
import { ModalChannelType } from './ModalChannelMenu'
import ModalGameMenu, { ModalGameType } from './ModalGameMenu'

const MAX_GOALS: number = 4;

interface Props {
	socket: Socket;
	gameMode: Difficulty,
	pseudo: string,
	infos: GameDto;
	leftPlayer: PlayerDisplayer,
	rightPlayer: PlayerDisplayer,
}

interface CanvasDimensions {
	width: number,
	height: number;
	y: number
}

const Playground = ({ socket, gameMode, pseudo, infos, leftPlayer, rightPlayer }: Props) => {

	const dimensions = useRef<CanvasDimensions>();
	const [startBtn, setStartBtn] = useState<BtnStatus>("idle")
	const newInfos = useRef<GameDto>();
	const timer = useRef<NodeJS.Timeout>()
	const [activeError, setActiveError] = useState<ModalGameType>()
	const gameFrameRef = useRef<HTMLDivElement>(null)
	const borderColor = useRef<string>();

	const ball: BallDisplayer = new BallDisplayer(
		socket,
		50,
		"grey",
		infos,
	)
	const drawer: DrawerDisplayer = new DrawerDisplayer(
		leftPlayer,
		rightPlayer,
		ball
	)




	useStartGameListener(socket, ({leftPaddle, rightPaddle, ball: _ball}: MoveObjects) => {
		clearTimeout(timer.current)
		leftPlayer.paddle.display(leftPaddle)
		rightPlayer.paddle.display(rightPaddle)
		ball.display(_ball)
		setStartBtn("good")
	}, () => {
		console.log("salut alors la c le start game qui est appelé")
		leftPlayer.paddle.plugMove = true;
		rightPlayer.paddle.plugMove = true;
		leftPlayer.paddle.setUp(drawer.canvas, drawer.context, drawer.canvasWidth, drawer.canvasHeight)
		rightPlayer.paddle.setUp(drawer.canvas, drawer.context, drawer.canvasWidth, drawer.canvasHeight)
	})
	
	useUpdateGameListener(socket, (moveObjects: MoveObjects) => {
		drawer.updateGame(moveObjects)
	})

	const score = useUpdateScoreListener(socket, infos)

	const isFinished = useEndGameListener(socket, (gameInfos) => {
		newInfos.current = gameInfos;
	})



	useEffect(() => {
		// if (startBtn === "good")
		// 	clearTimeout(timer.current)
		// if (timer.current === undefined) {
		// 	timer.current = setTimeout(() => {
		// 		setActiveError(ModalGameType.ERRORSEARCHPLAYER)
		// 	}, 20 * 1000)
		// }
	}, [startBtn])

	useEffect(() => {
		if (gameFrameRef.current) {
			gameFrameRef.current.style.width = '70%';
			gameFrameRef.current.style.height = 'auto'
		}
	}, [gameFrameRef])



	return (
		<div className="playground-container">

			<div className="game-container">
				<p className="mode-game">{gameMode} Game</p>
				<div className="all-game"> 
					<div className="login-score">
						<div className="login-container">
							<p className="first-login">{infos.player1.pseudo}</p>
							<p className="second-login">{infos.player2.pseudo}</p>
						</div>
					</div>
					<div className="game-pdv" >
						<p className="scoregreen ">SCORE: {score[0]}</p>
						{/* <FontAwesomeIcon className="heartgreen" icon={faHeartBroken} />
						<FontAwesomeIcon className="heartgreen" icon={faHeartBroken} />
						<FontAwesomeIcon className="heartgreen" icon={faHeartBroken} /> */}

						<p className="game-time">Score max: 3</p>

						{/* <FontAwesomeIcon className="heartred" icon={faHeartBroken} />
						<FontAwesomeIcon className="heartred" icon={faHeartBroken} />
						<FontAwesomeIcon className="heartred" icon={faHeartBroken} /> */}
						<p className="scorered">SCORE: {score[1]}</p>
					</div>
					<div ref={gameFrameRef} style={{'--color': borderColor.current } as React.CSSProperties} className="game-frame">
						<Container>
							{/* {isCanvasReady([playgroundWidth, playgroundHeight]) &&
							<Canvas display={gameLoop} id="playground"
							width={playgroundWidth} height={playgroundHeight} />} */}
							<Canvas $onResize={(canvas) => {
								if (canvas) {
									canvas.width = canvas.offsetWidth; // quand on size le canvas avec ces variables, le canvas gere bien les pixels
									canvas.height = canvas.offsetHeight; // il suffit d'enlever pour voir comment ca rend
									const canvasWidth = canvas?.getBoundingClientRect().width
									const canvasHeight = canvas?.getBoundingClientRect().height
									const canvasPosY = canvas?.getBoundingClientRect().top
									drawer.clearBgnd();
									drawer.drawBgnd();
									leftPlayer.paddle.handleResize(canvas, canvasWidth, canvasHeight, canvasPosY)
									rightPlayer.paddle.handleResize(canvas, canvasWidth, canvasHeight, canvasPosY)
									ball.handleResize(canvas, canvasWidth, canvasHeight, canvasPosY)
								}
							}}
							onInit={(context, canvasWidth, canvasHeight, canvas) => 
								drawer.setUpGame(context, canvasWidth, canvasHeight, canvas)
							}
							id="playground" />
						</Container>
					</div>
					{
						startBtn === "idle" && 
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
						<div className="pulseBtn-wrap">
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
						</div> ||

						<div className="pulseBtn-wrap" />
					}
					{
						(() => {console.log("newInfos.current = ", newInfos.current, " isFinished = ", isFinished, " pseudo = ", pseudo); return true})() &&
						isFinished && pseudo && newInfos.current !== undefined &&
						<ModalGameStatMenu active={isFinished} type={ModalGameStatType.ENDGAME}
						gameInfos={newInfos.current} pseudo={pseudo}
						callback={() => {
							ClientApi.redirect = new URL(BASE_URL)
						}}
						callbackFail={() => {
							ClientApi.redirect = new URL(BASE_URL)
						}} />
					}
					{ activeError !== undefined &&
						<ModalGameMenu active={activeError !== undefined ? true : false}
						type={activeError}
						callback={() => {
							ClientApi.redirect = new URL(BASE_URL)
						}}
						callbackFail={() => {
							ClientApi.redirect = new URL(BASE_URL)
						}} />
					}
				</div>
			</div>
		</div>
	)
};

export default Playground;