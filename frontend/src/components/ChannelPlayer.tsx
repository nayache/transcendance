import React, { useRef, useState } from 'react'
import { Status } from '../constants/EMessage'
import '../styles/ChannelPlayer.css'
import UserPreview from './UserPreview'

interface Props {
	playerName: string,
	status: Status,
	doDisplayPreview: boolean,
	onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void,
	onClosePreview: () => void,
}

const ChannelPlayer = ({ playerName, status, doDisplayPreview, onClick, onClosePreview }: Props) => {


	const channelPlayerRef = useRef<HTMLDivElement>(null)


	return (
		<React.Fragment>
			<div ref={channelPlayerRef} className="channelPlayer-container">
				{ doDisplayPreview &&
				<UserPreview playername={playerName} status={status}
				onClose={onClosePreview} /> }
				<button onClick={onClick} className="playerName button_without_style">
					{playerName}
				</button>
			</div>
		</React.Fragment>
	)
}

export default ChannelPlayer