import React, { useEffect, useRef } from "react";
import "../styles/Notification.css"
import {BsCheck2} from 'react-icons/bs'
import {RxCross1} from 'react-icons/rx'
import { useResizeText } from "../hooks/useResizeText";
import { IMessageEvRecv } from "../interface/IMessage";
import { IFriendEv } from "../interface/IFriend";

export enum NotificationType {
	NEWFRIEND,
	ACCEPTEDFRIEND,
	INVITEGAME,
	DM
}


interface Props {
	active: boolean,
	type: NotificationType,
	infos: IMessageEvRecv | IFriendEv | undefined,
	callback?: (props?: any) => void,
	callbackFail?: (props?: any) => void,
}

const Notification = ({active, type, infos, callback, callbackFail}: Props) => {
	



	useEffect(() => {
		if (active)
			setTimeout(() => {
				if (callbackFail)
					callbackFail({type})
			}, 8000);
	}, [active])




	const newFriend = (infos: IFriendEv) => {
		return (
			<div className="notification" onClick={() => {
				if (callback)
					callback({type, infos})
			}}>
				<div className="notif-container">
					<p className="notif-title">New friend request</p>
					<p className="notif-msg">{infos.pseudo} sent you a friend request</p>
				</div>
			</div>
		)
	}
	
	const acceptedFriend = (infos: IFriendEv) => {
		return (
			<div className="notification" onClick={() => {
				if (callback)
					callback({type, infos})
			}}>
				<div className="notif-container">
					<p className="notif-title">Accepted friend request</p>
					<p className="notif-msg">{infos.pseudo} accepted your friend request</p>
				</div>
			</div>
		)
	}
	
	const dm = (infos: IMessageEvRecv) => {
		return (
			<div className="notification" onClick={() => {
				if (callback)
					callback({type, infos})
			}}>
				<div className="notif-container">
					<p className="notif-title">{infos.author}</p>
					<p className="notif-msg">{infos.message}</p>
				</div>
			</div>
		)
	}


	return (
		<React.Fragment>
			{/* <div className="notification-container"> */}
				{ active && (
					type === NotificationType.NEWFRIEND &&
					newFriend(infos as IFriendEv) ||
					
					type === NotificationType.ACCEPTEDFRIEND &&
					acceptedFriend(infos as IFriendEv) ||
					
					type === NotificationType.DM &&
					dm(infos as IMessageEvRecv)
				)}
			{/* </div> */}
		</React.Fragment>
	)

}

export default Notification