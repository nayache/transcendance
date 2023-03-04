import React, { useRef, useState } from 'react'
import { ChannelRole, Status } from '../constants/EMessage'
import '../styles/ChannelPlayer.css'
import UserPreview from './UserPreview'
import OwnerLogo from '../img/owner-logo.png'
import ModoLogo from '../img/modo-logo.png'
import { IChannelUser } from '../interface/IChannelUser'

interface Props {
	pseudo?: string,
	player: IChannelUser
	doDisplayPreview: boolean,
	onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void,
	onClosePreview: () => void,
}

const ChannelPlayer = ({ pseudo, player, doDisplayPreview, onClick, onClosePreview }: Props) => {


	const channelPlayerRef = useRef<HTMLDivElement>(null)
	const { pseudo: playerName, role, status } = player


	return (
		<React.Fragment>
			<div ref={channelPlayerRef} className="channelPlayer-container-container">
				{ doDisplayPreview &&
				<UserPreview pseudo={pseudo} player={player}
				onClose={onClosePreview} /> }
				<button onClick={onClick} className="playerName button_without_style">
					{
						role === ChannelRole.OWNER && <img className='logo-role' src={OwnerLogo} /> ||
						role === ChannelRole.ADMIN && <img className='logo-role' src={ModoLogo} />
					}
					<div className='playerName-text'>{playerName}</div>
					<div className='circle custom-on-circle online' />
				</button>
			</div>
		</React.Fragment>
	)
}

export default ChannelPlayer