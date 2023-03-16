import React from "react";
import "../styles/GoPlay.css"
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import Loader from "../img/pong.gif"
import { GameMode } from "./Home";
import { Link, redirect, useParams } from "react-router-dom";
import { BASE_URL } from "../constants/RoutesApi";
import ClientApi from "./ClientApi.class";
import { usePseudo } from "../hooks/usePseudo";


interface Props {
	gameMode?: GameMode
}

const GoPlay = () => {


	const pseudo = usePseudo()
	const [loader, setLoader] = useState(false);
	const gameMode: GameMode = useParams().mode as GameMode





	useEffect (() => {
		setTimeout(() => {
			setLoader(false);
		}, 3000)
	}, [])

	useEffect(() => {
		console.log("gamemode = ", gameMode)
		if (!(gameMode === "classic" || gameMode === "hard" || gameMode === "medium"))
			ClientApi.redirect = new URL(BASE_URL)
	}, [gameMode])


	

	

	return (
		<React.Fragment>
		{ (gameMode === "classic" || gameMode === "hard"
		|| gameMode === "medium") &&
			<div>
			<Navbar/>
				<div className="play-container">
					{ !loader ?
						<button className="goplay"
							onClick={() => setLoader(true)}>
							PLAY {gameMode.toUpperCase()} GAME
						</button> :
						<img className="loaderPong-img" src={Loader}/>}
				</div>
			</div>
		}
		</React.Fragment>
	)
}

export default GoPlay