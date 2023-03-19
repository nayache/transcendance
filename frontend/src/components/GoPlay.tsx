import React from "react";
import "../styles/GoPlay.css"
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import Loader from "../img/pong.gif"
import { Difficulty } from "../interface/IGame";
import ClientApi from "./ClientApi.class";
import { API_GAME_INVITE, BASE_URL } from "../constants/RoutesApi";


interface Props {
	gameMode?: Difficulty,
	invited?: string | undefined,
	onClick?: (props?: any) => void,
}

const GoPlay = ({gameMode, invited, onClick}: Props) => {	

	const [loader, setLoader] = useState<boolean>(false)
	

	return (
		<React.Fragment>
		{ (gameMode === Difficulty.EASY || gameMode === Difficulty.MEDIUM ||
			gameMode === Difficulty.HARD) &&
			<div>
				<div className="play-container">
					{ (loader || invited) ?
						<div>
							<img className="loaderPong-img" src={Loader}/>
							<p>{invited ? "Waiting for opponent..." : "Searching player..."}</p>
						</div> :
						<button className="goplay"
						onClick={() => {
							setLoader(true)
							if (onClick)
								onClick()
						}}>
							PLAY {gameMode.toUpperCase()} GAME
						</button>
					}
					<button className="button-24" onClick={async () => {
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
						ClientApi.redirect = new URL(BASE_URL)
					}}>Cancel</button>
				</div>
			</div>
		}
		</React.Fragment>
	)
}

export default GoPlay