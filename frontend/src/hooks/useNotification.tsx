import React, { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client";
import ClientApi from "../components/ClientApi.class";
import { Friend, Pending } from "../components/Friends";
import Notification, { NotificationType } from "../components/Notification";
import { MESSAGES_ROUTE, MYFRIENDS_EP } from "../constants/RoutesApi";
import { IFriendEv } from "../interface/IFriend";
import { IMessageEvRecv } from "../interface/IMessage";
import { IUser } from "../interface/IUser";
import { useDMListener } from "./useDMListener";
import { useNewFriendAccListener } from "./useFriendAccUpdater";
import { useNewFriendReqListener } from "./useNewFriendReqListener";


export const useNotification = (
	socket: Socket | undefined,
	user: IUser,
	currpage?: string,
	addPending?: (pending: Pending) => void,
	addFriend?: (friend: Friend) => void,
) => {

	const infos = useRef<IMessageEvRecv | IFriendEv | undefined>(undefined);
	const [notificationType, setNotificationType] = useState<NotificationType | null>(null)

	useDMListener(socket, user, undefined, undefined, undefined, (payload) => {
		infos.current = payload
		console.log("infos.current = ", infos.current)
		setNotificationType(NotificationType.DM)
	})
	if (currpage === MYFRIENDS_EP) {
	}
	else {
		useNewFriendReqListener(socket, user.pseudo, undefined, (payload) => {
			infos.current = payload
			console.log("infos.current = ", infos.current)
			setNotificationType(NotificationType.NEWFRIEND)
		})
		useNewFriendAccListener(socket, user.pseudo, undefined, (payload) => {
			infos.current = payload
			console.log("infos.current = ", infos.current)
			setNotificationType(NotificationType.ACCEPTEDFRIEND)
		})
	}
	
	return (
		<React.Fragment>
			{
				currpage === MYFRIENDS_EP && notificationType !== null && infos.current !== undefined &&
				<Notification active={notificationType !== null ? true : false} type={notificationType}
				infos={infos.current}
				callback={({type, infos}) => {
					if (type === NotificationType.DM)
						ClientApi.redirect = new URL(MESSAGES_ROUTE + '/' + infos.author)
				}}
				callbackFail={() => {
					infos.current = undefined
					setNotificationType(null)
				}} />
				||

				notificationType !== null && infos.current !== undefined &&
				<Notification active={notificationType !== null ? true : false} type={notificationType}
				infos={infos.current}
				callback={({type, infos}) => {
					if (type === NotificationType.DM)
						ClientApi.redirect = new URL(MESSAGES_ROUTE + '/' + infos.author)
					if (type === NotificationType.NEWFRIEND || type === NotificationType.ACCEPTEDFRIEND)
						ClientApi.redirect = new URL(MYFRIENDS_EP)
				}}
				callbackFail={() => {
					infos.current = undefined
					setNotificationType(null)
				}} />
			}
		</React.Fragment>
	)
}