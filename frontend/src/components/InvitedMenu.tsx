import React, { useCallback, useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class";
import '../styles/InvitedMenu.css'
import { Difficulty, GameDto } from "../interface/IGame";
import { API_GAME_ACCEPT, GAMEPAGE_ROUTE } from "../constants/RoutesApi";


interface Props {
	pseudo: string,
	author: string,
	difficulty: Difficulty,
	onInvited?: (props?: any) => void
	onInvitedFail?: (props?: any) => void
}

export const InvitedMenu = ({ pseudo, author, difficulty, onInvited, onInvitedFail }: Props) => {
	

	const handleAccept = async (response: boolean) => {
		if (onInvited)
			onInvited({response})
	}


	return (
		<React.Fragment>
			<div>
				<p className="challenge-title">{author} invited you for a game</p>
				<p className="challenge-text">Do you accept the challenge ? Difficulty: {difficulty}</p>
				<button style={{'--color': 'blue' } as React.CSSProperties}
				className="challengeBtn" onClick={() => handleAccept(true)}>Accept</button>
				<button style={{'--color': 'red' } as React.CSSProperties}
				className="challengeBtn" onClick={() => handleAccept(false)}>Decline</button>
			</div>
		</React.Fragment>
	)
}

export default InvitedMenu