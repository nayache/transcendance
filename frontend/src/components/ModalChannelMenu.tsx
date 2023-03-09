import React, { useRef, useState } from 'react'
import { IChannel, IChannelUser } from '../interface/IChannelUser';
import '../styles/ModalChannelMenu.css'
import CreateChannelMenu from './CreateChannelMenu';
import EditChannelMenu from './EditChannelMenu';
import JoinChannelMenu from './JoinChannelMenu';
import JoinOrCreateChannelMenu from './JoinOrCreateChannelMenu';
import LeaveChannelMenu from './LeaveChannelMenu';

export enum ModalChannelType {
	JOINORCREATECHANNEL,
	LEAVECHANNEL,
	EDITCHANNEL,
}

interface Props {
	active: boolean,
	type: ModalChannelType,
	chanUser: IChannelUser,
	channels: IChannel[],
	currentChannelId: number,
	addChannel?: (channel: IChannel) => void,
	setCurrentChannel?: (channelName: string) => void,
	updateChannel?: (channel: IChannel) => void,
	removeChannel?: (channelName: string, genUpdated: IChannel | null) => void,
	pointedChannelName?: string,
	pointedChannelPrv?: boolean,
	pointedChannelPassword?: boolean,
	callback?: () => any,
	callbackFail?: () => any,
}

const ModalChannelMenu = ({ active, type, chanUser, channels, currentChannelId,
	addChannel, setCurrentChannel, removeChannel, updateChannel, pointedChannelPrv,
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

	{
		if (modalRef.current) {
			modalRef.current.style.display = active ? "block" : "none";
		}
	}

	return (
		<div id="myModal-channelMenu"
		ref={modalRef} className="modalChannelMenu">
			<div className="modalChannelMenu-content">
				<span onClick={(e) => handleClick(callbackFail)}
				className="close-channelMenu">&times;</span>
				{
					update === "CREATECHANNEL" && addChannel && setCurrentChannel &&
					<CreateChannelMenu addChannel={addChannel}
					setCurrentChannel={setCurrentChannel}
					onCreate={() => onCreate()} chanUser={chanUser} /> ||
					
					update === "JOINCHANNEL" && addChannel && setCurrentChannel &&
					<JoinChannelMenu addChannel={addChannel} channels={channels}
					setCurrentChannel={setCurrentChannel}
					onJoin={() => onJoin()} chanUser={chanUser} /> ||
					
					type === ModalChannelType.JOINORCREATECHANNEL
					&& <JoinOrCreateChannelMenu
					onJoinClick={onJoinClick} onCreateClick={onCreateClick} /> ||
					
					type === ModalChannelType.LEAVECHANNEL && pointedChannelName
					&& setCurrentChannel && removeChannel && updateChannel
					&& <LeaveChannelMenu channels={channels} currentChannelId={currentChannelId}
					setCurrentChannel={setCurrentChannel} removeChannel={removeChannel}
					updateChannel={updateChannel} chanUser={chanUser} channelName={pointedChannelName}
					onLeave={() => onLeave()} /> ||
					
					type === ModalChannelType.EDITCHANNEL
					&& pointedChannelName && pointedChannelPassword !== undefined && pointedChannelPrv !== undefined
					&& <EditChannelMenu chanUser={chanUser} channelName={pointedChannelName}
					channelPrv={pointedChannelPrv} channelPassword={pointedChannelPassword}
					onEdit={() => onEdit()} />
				}
			</div>
		</div>
	)
}

export default ModalChannelMenu;