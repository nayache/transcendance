import React, { useRef, useState } from 'react'
import { ChannelRole, Status } from '../constants/EMessage'
import '../styles/ChannelPlayer.css'
import UserPreview from './UserPreview'
import OwnerLogo from '../img/owner-logo.png'
import ModoLogo from '../img/modo-logo.png'
import { IChannel, IChannelUser } from '../interface/IChannel'
import { useResizeText } from '../hooks/useResizeText'

interface Props {
	chanUser: IChannelUser | undefined,
	player: IChannelUser,
	channel: IChannel,
	doDisplayPreview: boolean,
	callbackPreview?: (props?: any) => void,
	callbackFailPreview?: (props?: any) => void,
	onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void,
	onClosePreview?: () => void,
}

const ChannelPlayer = ({ chanUser, player, channel, doDisplayPreview, onClick, onClosePreview, callbackPreview, callbackFailPreview }: Props) => {


	const { pseudo: playerName, role, status } = player
	const playerTextRef = useResizeText(useRef<HTMLParagraphElement>(null))
	const statusMap = new Map<Status, string>([
		[Status.OFFLINE, "offline"],
		[Status.ONLINE, "online"],
		[Status.INGAME, "ingame"],
	]);


	return (
		<React.Fragment>
			<div className="channelPlayer-container-container">
				{ doDisplayPreview &&
				<UserPreview chanUser={chanUser} player={player} channel={channel}
				onClose={onClosePreview} callback={callbackPreview} callbackFail={callbackFailPreview} /> }
				<button onClick={onClick} className="playerName button_without_style">
					{
						role === ChannelRole.OWNER && <img className='logo-role' src={OwnerLogo} /> ||
						role === ChannelRole.ADMIN && <img className='logo-role' src={ModoLogo} />
					}
					<p ref={playerTextRef} className='playerName-text'>{playerName}</p>
					<div className={'circle custom-on-circle ' + statusMap.get(player.status)} />
				</button>
			</div>
		</React.Fragment>
	)
}

export default ChannelPlayer