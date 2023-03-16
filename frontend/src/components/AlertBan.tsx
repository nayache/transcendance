import React from "react"
import '../styles/AlertBan.css'
import '../styles/AlertKick.css'

interface Props {
	author: string,
	channelName: string,
	onBanClick?: () => void
}

export const AlertBan = ({ author, channelName, onBanClick }: Props) => {

	return (
		<React.Fragment>
			<div className="JoinOrAdd-buttons-container">
				<p>{author} banned you from the <b>{channelName}</b> channel<br />
				You cannot enter channel again...</p>
				<button onClick={onBanClick} className="okay-button button_without_style">
					Okay...
				</button>
			</div>
		</React.Fragment>
	)
}

export default AlertBan