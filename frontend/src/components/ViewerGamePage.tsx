import React, { useEffect, useRef, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import ViewerPlayground from "./ViewerPlayground";
import ClientApi from "./ClientApi.class";
import GoPlay from "./GoPlay";
import { API_GAME_INFOS, API_GAME_SEARCH, API_GAME_VIEW, BASE_URL } from "../constants/RoutesApi";
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
	const matchId = useParams().matchId as string
	const [infos, setInfos] = useState<GameDto>()
	


	
	useEffect(() => {
		(async () => {
			try {
				if (matchId) {
					const data = await ClientApi.get(API_GAME_INFOS + '/' + matchId)
					socket.emit('viewer', matchId)
					setInfos(data.infos as GameDto)
					setGo(true)
				}
			}
			catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [matchId])





	return (
		<React.Fragment>
			{ go && pseudo && infos && (
				<React.Fragment>
					<Background />
					<ViewerPlayground socket={socket} pseudo={pseudo} infos={infos} />
				</React.Fragment>
			) }
		</React.Fragment>
	)
}
export default ViewerGamePage;