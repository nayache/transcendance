import React, { useEffect, useRef, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import ClientApi from "./ClientApi.class";
import GoPlay from "./GoPlay";
import { API_GAME_SEARCH, BASE_URL } from "../constants/RoutesApi";
import { useParams } from "react-router-dom";
import { usePseudo } from "../hooks/usePseudo";
import { Difficulty, GameDto } from "../interface/IGame";
import { useSocket } from "../hooks/useSocket";

const GamePage: React.FC = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const gameMode: Difficulty = useParams().mode as Difficulty
	const [go, setGo] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	const [infos, setInfos] = useState<GameDto>()
	
	useEffect(() => {
		if (clicked) {
			socket?.on('matchEvent', (gameInfos: GameDto) => {
				console.log("(matchEvent) gameInfos = ", gameInfos)
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

			go && infos !== undefined && (
				<React.Fragment>
					<Background />
					<Baseline title="Ping pong mais dans gamepage"/>
					<Playground socket={socket} infos={infos}/>
				</React.Fragment>
			) }
		</React.Fragment>
	)
}
export default GamePage;