import React, { useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class"
import '../styles/InviteChannelMenu.css'
import { Difficulty } from "../interface/IGame"
import { API_GAME_INVITE } from "../constants/RoutesApi"

interface Props {
	target: string,
	onInvite?: (props?: any) => void,
	onInviteFail?: (props?: any) => void,
}


interface ButtonInfos {
	difficulty: Difficulty,
	color: string,
}

export const InviteChannelMenu = ({ target, onInvite, onInviteFail }: Props) => {

	const [buttonInfos, setButtonInfos] = useState<ButtonInfos[]>([
		{
			difficulty: Difficulty.EASY,
			color: '#74ff67'
		},
		{
			difficulty: Difficulty.MEDIUM,
			color: '#58fff7'
		},
		{
			difficulty: Difficulty.HARD,
			color: '#ff4949'
		},
	])



	const handleClick = async (difficulty: Difficulty) => {
		if (onInvite)
			onInvite({difficulty})
	}



	return (
		<React.Fragment>
			<p className="invite-text">Choose the difficulty</p>
			<div className="buttonsInvite-container">
				{ buttonInfos.map(buttonInfo => (
					<div>
						<button onClick={() => handleClick(buttonInfo.difficulty)}
						style={{'--color': buttonInfo.color } as React.CSSProperties} className="challengeBtn">
							<span />
							<span />
							<span />
							<span />
							{buttonInfo.difficulty}
						</button>
					</div>
				))}
			</div>
		</React.Fragment>
	)
}

export default InviteChannelMenu