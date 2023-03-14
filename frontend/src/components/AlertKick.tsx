import React from "react"
import '../styles/AlertKick.css'

interface Props {
	author: string,
	channelName: string,
	onKickClick?: () => void
}

export const AlertKick = ({ author, channelName, onKickClick }: Props) => {

	return (
		<React.Fragment>
			<div className="JoinOrAdd-buttons-container">
				<p>{author} kicked you out from the <b>{channelName}</b> channel</p>
				<button onClick={onKickClick} className="okay-button button_without_style">
					Okay...
				</button>
			</div>
		</React.Fragment>
	)
}

export default AlertKick