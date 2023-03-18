import React from "react";
import "../styles/GoPlay.css"
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import Loader from "../img/pong.gif"
import { Difficulty } from "../interface/IGame";
import ClientApi from "./ClientApi.class";
import { BASE_URL } from "../constants/RoutesApi";


interface Props {
	gameMode?: Difficulty,
	onClick?: (props?: any) => void,
}

const GoPlay = ({gameMode, onClick}: Props) => {	

	const [loader, setLoader] = useState<boolean>(false)
	

	return (
		<React.Fragment>
		{ (gameMode === Difficulty.EASY || gameMode === Difficulty.MEDIUM ||
			gameMode === Difficulty.HARD) &&
			<div>
			<Navbar/>
				<div className="play-container">
					{ !loader ?
						<button className="goplay"
							onClick={() => {
								setLoader(true)
								if (onClick)
									onClick()
							}}>
							PLAY {gameMode.toUpperCase()} GAME
						</button> :
						<div>
							<img className="loaderPong-img" src={Loader}/>
							<p>Searching player...</p>
						</div>}
						<button className="button-24" onClick={() =>
							ClientApi.redirect = new URL(BASE_URL)
						}>Cancel</button>
				</div>
			</div>
		}
		</React.Fragment>
	)
}

export default GoPlay