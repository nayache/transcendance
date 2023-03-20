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

const MAX_GOALS: number = 4;

interface Props {
	socket: Socket;
	pseudo: string,
	infos: GameDto
}

interface CanvasDimensions {
	width: number,
	height: number;
	y: number
}

const Playground = ({ socket, pseudo, infos }: Props) => {

	const dimensions = useRef<CanvasDimensions>();
	const [newInfos, setNewInfos] = useState<GameDto>();
	const gameFrameRef = useRef<HTMLDivElement>(null)
	

	
	const leftPaddle: PaddleDisplayer = new PaddleDisplayer(
		socket,
		undefined,
	)
	const leftPlayer = new PlayerDisplayer(PlayerSide.Left, leftPaddle)
	const rightPaddle: PaddleDisplayer = new PaddleDisplayer(
		socket,
		undefined,
	)
	const rightPlayer = new PlayerDisplayer(PlayerSide.Right, rightPaddle)

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




	useStartGameListener(socket, ({leftPaddle, rightPaddle, ball: _ball}: MoveObjects) => {
		leftPlayer.paddle.display(leftPaddle)
		rightPlayer.paddle.display(rightPaddle)
		ball.display(_ball)
	}, () => {
		leftPlayer.paddle.plugMove = true;
		rightPlayer.paddle.plugMove = true;
	})
	
	useUpdateGameListener(socket, (moveObjects: MoveObjects) => {
		drawer.updateGame(moveObjects)
	})

	const score = useUpdateScoreListener(socket, infos)

	const isFinished = useEndGameListener(socket, (gameInfos) => {
		setNewInfos(gameInfos);
	})



	useEffect(() => {
		if (gameFrameRef.current) {
			gameFrameRef.current.style.height = 'auto'
		}
	}, [gameFrameRef])

	return (
		<div className="playground-container">

			<div className="game-container">
				<p className="mode-game"> Game</p>
				<div className="all-game"> 
					<div className="login-score">
						<div className="login-container">
							<p className="first-login">{infos.player1.pseudo}</p>
							<p className="second-login">{infos.player2.pseudo}</p>
						</div>
						<div className="game-pdv" >
							<p className="scoregreen ">SCORE: {score[0]}</p>
							{/* <FontAwesomeIcon className="heartgreen" icon={faHeartBroken} />
							<FontAwesomeIcon className="heartgreen" icon={faHeartBroken} />
							<FontAwesomeIcon className="heartgreen" icon={faHeartBroken} /> */}

							{/* <p className="game-time">00:00</p> */}

							{/* <FontAwesomeIcon className="heartred" icon={faHeartBroken} />
							<FontAwesomeIcon className="heartred" icon={faHeartBroken} />
							<FontAwesomeIcon className="heartred" icon={faHeartBroken} /> */}
							<p className="scorered">SCORE: {score[1]}</p>
						</div>
						<div className="game-frame">
							<Container>
								{/* {isCanvasReady([playgroundWidth, playgroundHeight]) &&
								<Canvas display={gameLoop} id="playground"
								width={playgroundWidth} height={playgroundHeight} />} */}
								<Canvas
									$onResize={(canvas) => {
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
							isFinished && pseudo && newInfos &&
							<ModalGameStatMenu active={isFinished} type={ModalGameStatType.OTHERENDGAME}
							gameInfos={newInfos} pseudo={pseudo}
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
		</div>
	)
};

export default Playground;