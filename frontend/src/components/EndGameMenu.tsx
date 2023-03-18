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
	
	const playerSide = useRef<1 | 2>((gameInfos.player1.pseudo === pseudo) ? 1 : 2);
	const didWin = useRef<boolean>();
	
	useEffect(() => {
		if (playerSide.current === 1) {
			didWin.current = (gameInfos.score1 >= gameInfos.score2) ? true : false
		}
		else {
			didWin.current = (gameInfos.score2 >= gameInfos.score1) ? true : false
		}
	}, [])

	return (
		<React.Fragment>
			{ playerSide.current && didWin.current !== undefined &&
				<div className="endGame-container">
					<div className="endGame-child">
						<p className={didWin.current === true ? "endGame-win-title" : "endGame-lose-title"}>
							{didWin.current ? (gameInfos.forfeit ? "Win by forfeit" : "Win !")
							: "Lose"}
						</p>
						<p className="endGame-player-title">{gameInfos.ranked ? "Ranked game infos" : "Game infos"}</p>
						<p>Difficulty: {gameInfos.difficulty}</p>
						<p>Xp won: {playerSide.current === 1 ? gameInfos.xp1 : gameInfos.xp2}</p>
					</div>
				</div>
			}
		</React.Fragment>
	)
}

export default EndGameMenu