// import React, { useEffect, useRef, useState } from "react"
// import Background from './Background'
// import Baseline from "./Baseline";
// import ViewerPlayground from "./ViewerPlayground";
// import ClientApi from "./ClientApi.class";
// import GoPlay from "./GoPlay";
// import { API_GAME_INFOS, API_GAME_SEARCH, API_GAME_VIEW, BASE_URL } from "../constants/RoutesApi";
// import { useParams } from "react-router-dom";
// import { usePseudo } from "../hooks/usePseudo";
// import { Difficulty, GameDto, PlayerDto } from "../interface/IGame";
// import { useSocket } from "../hooks/useSocket";
// import PaddleDisplayer from "./PaddleDisplayer.class";
// import PlayerDisplayer, { PlayerSide } from "./PlayerDisplayer.class";

// const ViewerGamePage: React.FC = () => {

// 	const socket = useSocket()
// 	const pseudo = usePseudo()
// 	const [go, setGo] = useState<boolean>(false)
// 	const gameId = useParams().gameId as string
// 	const [infos, setInfos] = useState<GameDto>()
	


	
// 	useEffect(() => {
// 		(async () => {
// 			try {
// 				if (gameId) {
// 					socket.emit('viewer', gameId)
// 					const data = await ClientApi.get(API_GAME_INFOS)
// 					setInfos(data.infos as GameDto)
// 					setGo(true)
// 				}
// 			}
// 			catch (err) {
// 				console.log("err = ", err)
// 			}
// 		})()
// 	}, [gameId])





// 	return (
// 		<React.Fragment>
// 			{ go && pseudo && infos && (
// 				<React.Fragment>
// 					<Background />
// 					<ViewerPlayground socket={socket} pseudo={pseudo} infos={infos} />
// 				</React.Fragment>
// 			) }
// 		</React.Fragment>
// 	)
// }
// export default ViewerGamePage;
const ViewerGamePage = () => (<div>bois</div>)
export default ViewerGamePage