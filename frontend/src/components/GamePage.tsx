import React, { useEffect, useRef, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import ClientApi from "./ClientApi.class";
import GoPlay from "./GoPlay";
import { API_GAME_ACCEPT, API_GAME_SEARCH, BASE_URL } from "../constants/RoutesApi";
import { useParams } from "react-router-dom";
import { usePseudo } from "../hooks/usePseudo";
import { Difficulty, GameDto, PlayerDto } from "../interface/IGame";
import { useSocket } from "../hooks/useSocket";
import PaddleDisplayer from "./PaddleDisplayer.class";
import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";
import ModalGameMenu, { ModalGameType } from "./ModalGameMenu";



const GamePage: React.FC = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const gameMode: Difficulty = useParams().mode as Difficulty
	const [go, setGo] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	const [leftPlayer, setleftPlayer] = useState<PlayerDisplayer>()
	const [rightPlayer, setrightPlayer] = useState<PlayerDisplayer>()
	const [infos, setInfos] = useState<GameDto>()
	const [activeError, setActiveError] = useState<boolean>(false)
	const fromInvite = useParams().fromInvite
	const invited = useParams().invited
	const fromAccept = useParams().fromAccept
	const author = useParams().author




	useEffect(() => {
		if (clicked || invited || author) {
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
	}, [gameMode, clicked, fromInvite, author])

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
				setActiveError(true)
			}
		})()
	}, [author])

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
							setActiveError(true)
						}
					}
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [gameMode, clicked])




	return (
		<React.Fragment>
			{ !go && fromAccept === undefined &&
				<GoPlay gameMode={gameMode} fromInvite={fromInvite} onClick={() => setClicked(true)} /> ||

			go && pseudo && infos !== undefined && leftPlayer && rightPlayer && (
				<React.Fragment>
					<Background />
					<Playground socket={socket} gameMode={gameMode} pseudo={pseudo}
					infos={infos} leftPlayer={leftPlayer}
					rightPlayer={rightPlayer} />
				</React.Fragment>
			) }
			{ activeError &&
				<ModalGameMenu active={activeError} type={ModalGameType.ERRORSEARCHPLAYER}
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