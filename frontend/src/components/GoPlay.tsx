import React from "react";
import "../styles/GoPlay.css"
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Loader from "./pong.gif"


const GoPlay = () => {


	const [loader, setLoader] = useState(true);

	const handleClick = () => {
		return loader ? <img src={Loader}/> : <p>coucou</p>;
	}

	useEffect (() => {
		setTimeout(() => {
			setLoader(false);
		}, 3000)
	}, [])

	return (
		<div>
		<Navbar/>
			<div className="play-container">
				<button className="goplay"
					onClick={handleClick}>
					PLAY CLASSIC GAME
				</button>
			</div>
		</div>
	)
}

export default GoPlay