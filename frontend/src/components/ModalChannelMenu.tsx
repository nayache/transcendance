import React, { useRef, useState } from 'react'
import { IChannelUser } from '../interface/IChannelUser';
import '../styles/ModalChannelMenu.css'
import CreateChannelMenu from './CreateChannelMenu';
import JoinChannelMenu from './JoinChannelMenu';
import JoinOrCreateChannelMenu from './JoinOrCreateChannelMenu';
import LeaveChannelMenu from './LeaveChannelMenu';

export enum ModalChannelType {
	JOINORCREATECHANNEL,
	LEAVECHANNEL,
}

interface Props {
	active: boolean,
	type: ModalChannelType,
	chanUser: IChannelUser,
	pointedChannelName?: string,
	callback?: () => any,
	callbackFail?: () => any,
}

const ModalChannelMenu = ({ active, type, chanUser, pointedChannelName, callback, callbackFail }: Props) => {

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
					update === "CREATECHANNEL" && <CreateChannelMenu onCreate={() => onCreate()} chanUser={chanUser} /> ||
					update === "JOINCHANNEL" && <JoinChannelMenu onJoin={() => onJoin()} chanUser={chanUser} /> ||
					type === ModalChannelType.JOINORCREATECHANNEL && <JoinOrCreateChannelMenu
					onJoinClick={onJoinClick} onCreateClick={onCreateClick} /> ||
					type === ModalChannelType.LEAVECHANNEL && pointedChannelName
					&& <LeaveChannelMenu chanUser={chanUser} channelName={pointedChannelName}
					onLeave={() => onLeave()} />
				}
			</div>
		</div>
	)
}

export default ModalChannelMenu;