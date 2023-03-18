import React, { useEffect, useRef, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import ViewerPlayground from "./ViewerPlayground";
import ClientApi from "./ClientApi.class";
import GoPlay from "./GoPlay";
import { API_GAME_SEARCH, API_GAME_VIEW, BASE_URL } from "../constants/RoutesApi";
import { useParams } from "react-router-dom";
import { usePseudo } from "../hooks/usePseudo";
import { Difficulty, GameDto, PlayerDto } from "../interface/IGame";
import { useSocket } from "../hooks/useSocket";
import PaddleDisplayer from "./PaddleDisplayer.class";
import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";

const ViewerGamePage: React.FC = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const [go, setGo] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	const [leftPlayer, setleftPlayer] = useState<PlayerDisplayer>()
	const [rightPlayer, setrightPlayer] = useState<PlayerDisplayer>()
	const [infos, setInfos] = useState<GameDto>()
	const gameId = useParams().gameId as string
	


	
	useEffect(() => {
		(async () => {
			try {
				if (gameId)
					setGo(true)
			}
			catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [gameId])





	return (
		<React.Fragment>
			{ go && pseudo && infos !== undefined && leftPlayer && rightPlayer && (
				<React.Fragment>
					<Background />
					<ViewerPlayground socket={socket} pseudo={pseudo}
					infos={infos} leftPlayer={leftPlayer}
					rightPlayer={rightPlayer} />
				</React.Fragment>
			) }
		</React.Fragment>
	)
}
export default ViewerGamePage;