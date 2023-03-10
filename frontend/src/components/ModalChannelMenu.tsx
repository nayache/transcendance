import React, { useEffect, useRef, useState } from 'react'
import { IChannel, IChannelUser } from '../interface/IChannel';
import '../styles/ModalChannelMenu.css'
import BanChannelMenu from './BanChannelMenu';
import CreateChannelMenu from './CreateChannelMenu';
import EditChannelMenu from './EditChannelMenu';
import JoinChannelMenu from './JoinChannelMenu';
import JoinOrCreateChannelMenu from './JoinOrCreateChannelMenu';
import KickChannelMenu from './KickChannelMenu';
import LeaveChannelMenu from './LeaveChannelMenu';
import MuteChannelMenu from './MuteChannelMenu';

export enum ModalChannelType {
	JOINORCREATECHANNEL,
	LEAVECHANNEL,
	EDITCHANNEL,
	SETADMIN,
	MUTEUSER,
	KICKUSER,
	BANUSER,
}

interface Props {
	active: boolean,
	type: ModalChannelType,
	chanUser?: IChannelUser,
	channels?: IChannel[],
	currentChannelId?: number,
	addChannel?: (channel: IChannel) => void,
	setCurrentChannel?: (channelName: string) => void,
	updateChannel?: (channel: IChannel) => void,
	removeChannel?: (channelName: string, genUpdated: IChannel | null) => void,
	author?: IChannelUser,
	target?: IChannelUser,
	pointedChannelName?: string,
	pointedChannelPrv?: boolean,
	pointedChannelPassword?: boolean,
	callback?: () => any,
	callbackFail?: () => any,
}

const ModalChannelMenu = ({ active, type, chanUser, channels, currentChannelId,
	addChannel, setCurrentChannel, removeChannel, updateChannel, pointedChannelPrv, author, target,
	pointedChannelPassword, pointedChannelName, callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);
	const [update, setUpdate] = useState<string>("");


	const handleClick = (callback?: () => any | undefined, e?: React.MouseEvent) => {
		setUpdate("")
		if (callback)
			callback();
	}
	
	const onLeave = () => {
		handleClick(callback)
	}

	const onJoin = () => {
		console.log("onJoin")
		handleClick(callback)
	}
	
	const onCreate = () => {
		console.log("onCreate")
		handleClick(callback)
	}
	
	const onJoinClick = () => {
		setUpdate("JOINCHANNEL")
	}

	const onCreateClick = () => {
		setUpdate("CREATECHANNEL")
	}

	const onEdit = () => {
		handleClick(callback)
	}
	
	const onKick = () => {
		handleClick(callback)
	}
	
	const onBan = () => {
		handleClick(callback)
	}
	
	const onMute = () => {
		handleClick(callback)
	}

	useEffect(() => {
		console.log("type (dans modal) = ", type)
		console.log("active (dans modal) = ", active)
		if (modalRef.current) {
			modalRef.current.style.display = active ? "block" : "none";
		}
	}, [active])

	return (
		<div id="myModal-channelMenu"
		ref={modalRef} className="modalChannelMenu">
			<div className="modalChannelMenu-content">
				<span onClick={(e) => handleClick(callbackFail)}
				className="close-channelMenu">&times;</span>
				{
					update === "CREATECHANNEL" && addChannel && setCurrentChannel && chanUser &&
					<CreateChannelMenu addChannel={addChannel}
					setCurrentChannel={setCurrentChannel}
					onCreate={() => onCreate()} chanUser={chanUser} /> ||
					
					update === "JOINCHANNEL" && addChannel && setCurrentChannel && chanUser &&
					channels !== undefined &&
					<JoinChannelMenu addChannel={addChannel} channels={channels}
					setCurrentChannel={setCurrentChannel}
					onJoin={() => onJoin()} chanUser={chanUser} /> ||
					
					type === ModalChannelType.JOINORCREATECHANNEL
					&& <JoinOrCreateChannelMenu
					onJoinClick={onJoinClick} onCreateClick={onCreateClick} /> ||
					
					type === ModalChannelType.LEAVECHANNEL && pointedChannelName !== undefined
					&& chanUser !== undefined && channels !== undefined &&
					currentChannelId !== undefined
					&& setCurrentChannel && removeChannel && updateChannel
					&& <LeaveChannelMenu channels={channels} currentChannelId={currentChannelId}
					setCurrentChannel={setCurrentChannel} removeChannel={removeChannel}
					updateChannel={updateChannel} chanUser={chanUser} channelName={pointedChannelName}
					onLeave={() => onLeave()} /> ||
					
					type === ModalChannelType.EDITCHANNEL
					&& pointedChannelName !== undefined && chanUser !== undefined
					&& pointedChannelPassword !== undefined && pointedChannelPrv !== undefined
					&& <EditChannelMenu chanUser={chanUser} channelName={pointedChannelName}
					channelPrv={pointedChannelPrv} channelPassword={pointedChannelPassword}
					onEdit={() => onEdit()} /> ||
					
					type === ModalChannelType.KICKUSER
					&& pointedChannelName !== undefined && target !== undefined
					&& <KickChannelMenu channelName={pointedChannelName} target={target}
					onKick={() => onKick()} /> ||
					
					type === ModalChannelType.BANUSER
					&& pointedChannelName !== undefined && target !== undefined
					&& <BanChannelMenu channelName={pointedChannelName} target={target}
					onBan={() => onBan()} /> ||
					
					type === ModalChannelType.MUTEUSER
					&& pointedChannelName !== undefined && target !== undefined
					&& <MuteChannelMenu channelName={pointedChannelName} target={target}
					onMute={() => onMute()} /> ||
					
					type === ModalChannelType.SETADMIN
					&& pointedChannelName !== undefined && target !== undefined
					&& <MuteChannelMenu channelName={pointedChannelName} target={target}
					onMute={() => onMute()} />
				}
			</div>
		</div>
	)
}

export default ModalChannelMenu;