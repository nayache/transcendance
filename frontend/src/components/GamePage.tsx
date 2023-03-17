import React, { useEffect, useRef, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import ClientApi from "./ClientApi.class";
import GoPlay from "./GoPlay";
import { API_GAME_SEARCH, BASE_URL } from "../constants/RoutesApi";
import { useParams } from "react-router-dom";
import { usePseudo } from "../hooks/usePseudo";
import { Difficulty, GameDto, PlayerDto } from "../interface/IGame";
import { useSocket } from "../hooks/useSocket";
import PaddleDisplayer from "./PaddleDisplayer.class";
import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";

const GamePage: React.FC = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const gameMode: Difficulty = useParams().mode as Difficulty
	const [go, setGo] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	const [leftPlayer, setleftPlayer] = useState<PlayerDisplayer>()
	const [rightPlayer, setrightPlayer] = useState<PlayerDisplayer>()
	const [infos, setInfos] = useState<GameDto>()
	
	useEffect(() => {
		if (clicked) {
			socket?.on('matchEvent', ({game: gameInfos, me}: {game: GameDto, me: PlayerDto}) => {
				console.log("(matchEvent) gameInfos = ", gameInfos)
				console.log("(matchEvent) me = ", me)
				if (gameInfos.player1.id === me.id) {
					const leftPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
					)
					setleftPlayer(new PlayerDisplayer(PlayerSide.Left, leftPaddle, me))
					const rightPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
					)
					setrightPlayer(new PlayerDisplayer(PlayerSide.Right, rightPaddle, gameInfos.player2))
				}
				else {
					const rightPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
					)
					setrightPlayer(new PlayerDisplayer(PlayerSide.Right, rightPaddle, me))
					const leftPaddle: PaddleDisplayer = new PaddleDisplayer(
						socket,
						undefined,
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
	}, [gameMode, clicked])

	useEffect(() => {
		(async () => {
			console.log("gamemode = ", gameMode)
			if (!(gameMode === Difficulty.EASY || gameMode === Difficulty.MEDIUM ||
				gameMode === Difficulty.HARD))
				ClientApi.redirect = new URL(BASE_URL)
			else {
				try {
					if (clicked) {
						console.log("bonsoirrrrrrrrrrrrrrrrrrrrrrrrr")
						await ClientApi.post(API_GAME_SEARCH + '/' + gameMode)
					}
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [gameMode, clicked])




	return (
		<React.Fragment>
			{ !go &&
				<GoPlay gameMode={gameMode} onClick={() => setClicked(true)} /> ||

			go && infos !== undefined && leftPlayer && rightPlayer && (
				<React.Fragment>
					<Background />
					<Playground socket={socket} infos={infos} leftPlayer={leftPlayer}
					rightPlayer={rightPlayer} />
				</React.Fragment>
			) }
		</React.Fragment>
	)
}
export default GamePage;