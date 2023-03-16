import React from "react"
import '../styles/JoinOrAddChannelMenu.css'

interface Props {
	onJoinClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void,
	onCreateClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void,
}

export const JoinOrAddChannelMenu = ({ onJoinClick, onCreateClick }: Props) => {

	return (
		<React.Fragment>
			<div className="JoinOrAdd-buttons-container">
				<button onClick={onJoinClick} className="join-button button_without_style">Join a channel</button>
				<button onClick={onCreateClick} className="create-button button_without_style">Create a new channel</button>
			</div>
		</React.Fragment>
	)
}

export default JoinOrAddChannelMenu