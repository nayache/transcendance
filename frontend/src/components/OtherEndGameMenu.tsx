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

export const OtherEndGameMenu = ({ gameInfos, pseudo, onEndGame }: Props) => {
	


	
	return (
		<React.Fragment>
			<div className="endGame-container">
				<div className="endGame-child">
					<p>
						{gameInfos.player1.pseudo} {gameInfos.score1 > gameInfos.score2 ?
							"won" : "lost"
						}
					</p>
			</div>
			<div className="endGame-child">
				<p>{
					gameInfos.player2.pseudo} {gameInfos.score2 > gameInfos.score1 ?
						"won" : "lost"
					}
				</p>
			</div>
			</div>
		</React.Fragment>
	)
}

export default OtherEndGameMenu