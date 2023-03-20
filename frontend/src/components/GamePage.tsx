import React, { useEffect, useRef, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import ClientApi from "./ClientApi.class";
import GoPlay from "./GoPlay";
import { API_GAME_ACCEPT, API_GAME_INVITE, API_GAME_SEARCH, BASE_URL } from "../constants/RoutesApi";
import { useParams } from "react-router-dom";
import { usePseudo } from "../hooks/usePseudo";
import { Difficulty, GameDto, PlayerDto } from "../interface/IGame";
import { useSocket } from "../hooks/useSocket";
import PaddleDisplayer from "./PaddleDisplayer.class";
import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";
import ModalGameMenu, { ModalGameType } from "./ModalGameMenu";
import { AboutErr, IError, TypeErr } from "../constants/EError";



const GamePage: React.FC = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const gameMode: Difficulty = useParams().mode as Difficulty
	const [go, setGo] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	const [leftPlayer, setleftPlayer] = useState<PlayerDisplayer>()
	const [rightPlayer, setrightPlayer] = useState<PlayerDisplayer>()
	const [infos, setInfos] = useState<GameDto>()
	const [activeError, setActiveError] = useState<ModalGameType>()
	const invited = useParams().invited
	const author = useParams().author




	useEffect(() => {
		if (clicked || invited || author) {
			// setTimeout(async () => {
			// 	socket?.removeAllListeners('matchEvent')
			// 	try {
			// 		if (gameMode && invited) {
			// 			await ClientApi.delete(API_GAME_INVITE, JSON.stringify({
			// 				target: invited,
			// 				difficulty: gameMode as string
			// 			}))
			// 		}
			// 	}
			// 	catch (err) {
			// 		console.log("err = ", err)
			// 	}
			// 	setActiveError(ModalGameType.ERRORSEARCHPLAYER)
			// }, 20 * 1000)
			socket?.on('matchEvent', ({game: gameInfos, me}: {game: GameDto, me: PlayerDto}) => {
				console.log("(matchEvent) gameInfos = ", gameInfos)
				console.log("(matchEvent) me = ", me)
				if (gameInfos.player1.id === me.id) {
					const leftPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
						gameInfos,
					)
					setleftPlayer(new PlayerDisplayer(PlayerSide.Left, leftPaddle, me))
					const rightPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
						gameInfos,
					)
					setrightPlayer(new PlayerDisplayer(PlayerSide.Right, rightPaddle, gameInfos.player2))
				}
				else {
					const rightPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
						gameInfos,
					)
					setrightPlayer(new PlayerDisplayer(PlayerSide.Right, rightPaddle, me))
					const leftPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
						gameInfos,
					)
					setleftPlayer(new PlayerDisplayer(PlayerSide.Left, leftPaddle, gameInfos.player1))
				}
				setInfos(gameInfos);
				setGo(true)
			})
		}
		return () => {
			socket?.removeAllListeners('matchEvent')
		}
	}, [gameMode, clicked, invited, author])

	useEffect(() => {
		(async () => {
			try {
				if (author) {
					await ClientApi.post(API_GAME_ACCEPT, JSON.stringify({
						target: author,
						response: true
					}), 'application/json')
				}
			}
			catch (err) {
				console.log("err = ", err);
				setActiveError(ModalGameType.ERRORSEARCHPLAYER)
			}
		})()
	}, [author])


	useEffect(() => {
		(async () => {
			try {
				if (invited && gameMode) {
					await ClientApi.post(API_GAME_INVITE, JSON.stringify({
						target: invited,
						difficulty: (gameMode as string)
					}), 'application/json')
					socket.on('declineGame', () => {
						setActiveError(ModalGameType.DECLINEINVIT)
					})
				}
			}
			catch (err) {
				const _error: IError = err as IError;

				console.log("err = ", err);
				if (_error.about === AboutErr.TARGET && _error.type === TypeErr.REJECTED)
					setActiveError(ModalGameType.INVITNOTRESPONDED)
				else
					setActiveError(ModalGameType.ERRORSEARCHPLAYER)
			}
		})()
	}, [invited, gameMode])

	useEffect(() => {
		(async () => {
			console.log("gamemode = ", gameMode)
			if (!(gameMode === Difficulty.EASY || gameMode === Difficulty.MEDIUM ||
				gameMode === Difficulty.HARD))
				ClientApi.redirect = new URL(BASE_URL)
			else {
				try {
					if (clicked) {
						try {
							console.log("bonsoirrrrrrrrrrrrrrrrrrrrrrrrr")
							await ClientApi.post(API_GAME_SEARCH + '/' + gameMode)
						}
						catch (err) {
							console.log("err = ", err);
							setActiveError(ModalGameType.ERRORSEARCHPLAYER)
						}
					}
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [gameMode, clicked])

	useEffect(() => () => {
		(async () => {
			try {
				if (gameMode && invited) {
					await ClientApi.delete(API_GAME_INVITE, JSON.stringify({
						target: invited,
						difficulty: gameMode as string
					}))
				}
			}
			catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [])





	return (
		<React.Fragment>
			{ !go && author === undefined &&
				<GoPlay gameMode={gameMode} invited={invited} onClick={() => setClicked(true)} /> ||

			go && pseudo && infos !== undefined && leftPlayer && rightPlayer && (
				<React.Fragment>
					<Background />
					<Playground socket={socket} gameMode={gameMode} pseudo={pseudo}
					infos={infos} leftPlayer={leftPlayer}
					rightPlayer={rightPlayer} />
				</React.Fragment>
			) }
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
		</React.Fragment>
	)
}
export default GamePage;