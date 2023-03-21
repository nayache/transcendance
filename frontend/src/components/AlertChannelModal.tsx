import React, { useEffect, useRef, useState } from 'react'
import { IChannel, IChannelUser } from '../interface/IChannel';
import '../styles/AlertChannelModal.css'
import AlertBan from './AlertBan';
import AlertKick from './AlertKick';
import { AlertType } from './ChatPage';


interface Props {
	active: boolean,
	type: AlertType,
	channels: IChannel[],
	currentChannelId: number,
	author: IChannelUser,
	target?: string,
	pointedChannelName: string,
	callback?: () => any,
	callbackFail?: () => any,
}

const AlertChannelModal = ({ active, type, author, channels, currentChannelId, pointedChannelName,
	callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);


	const handleClick = (callback?: () => any | undefined, e?: React.MouseEvent) => {
		if (callback)
			callback();
	}
	
	const onBanClick = () => {
		handleClick(callback)
	}
	
	const onKickClick = () => {
		handleClick(callback)
	}

	useEffect(() => {
		// console.log("type (dans modal) = ", type)
		// console.log("active (dans modal) = ", active)
		if (modalRef.current) {
			modalRef.current.style.display = active ? "block" : "none";
		}
	}, [active])

	// console.log("modalRef.current = ", modalRef.current)
	return (
		<div id="myModal-channelMenu"
		ref={modalRef} className="modalChannelMenu">
			<div className="modalChannelMenu-content">
				<span onClick={(e) => handleClick(callbackFail)}
				className="close-channelMenu">&times;</span>
				{
					type === "ban" && pointedChannelName &&
					<AlertBan author={author.pseudo} channelName={pointedChannelName} onBanClick={onBanClick} /> ||

					type === "kick" &&
					<AlertKick author={author.pseudo} channelName={pointedChannelName} onKickClick={onKickClick} />
				}
			</div>
		</div>
	)
}

export default AlertChannelModal;
