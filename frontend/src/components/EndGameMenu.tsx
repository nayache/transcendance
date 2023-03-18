import React, { useCallback, useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class";
import '../styles/EndGameMenu.css'
import { GameDto } from "../interface/IGame";


interface Props {
	gameInfos: GameDto,
	pseudo: string,
	onEndGame?: () => void
}

interface IChannelPreview {
	name: string,
	password: boolean,
	prv: boolean
}

export const EndGameMenu = ({ gameInfos, pseudo, onEndGame }: Props) => {
	


	return (
		<React.Fragment>
			<div className="endGame-container">
				<div className="endGame-child">
					<p className="endGame-player-title">Player 1</p>
				</div>
				<div className="endGame-child">
					<p className="endGame-player-title">Player 2</p>
				</div>
			</div>
		</React.Fragment>
	)
}

export default EndGameMenu