import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { Friend, Pending } from "../components/Friends"
import { API_AVATAR_ROUTE, API_USER_BLOCK } from "../constants/RoutesApi"
import { IFriendEv } from "../interface/IFriend"
import DefaultImg from "../img/avatar2.jpeg"


export const useNewFriendReqListener = (
	socket: Socket | undefined,
	pseudo: string | undefined,
	addPending?: (pending: Pending) => void,
	onNotification?: (payload?: IFriendEv) => void
) => {	
	
	useEffect(() => {
		if (pseudo) {
			socket?.on('newRequest', async (payload: IFriendEv) => {
				// console.log("(newRequest) pseudo = ", pseudo, " et payload = ", payload)
				const data: { blockeds: string[] } = await ClientApi.get(API_USER_BLOCK);
				const isBlocked: boolean = data.blockeds.some(blocked => 
					blocked === payload.pseudo )
				// console.log("isBlocked = ", isBlocked)
				if (!isBlocked)
				{
					if (ClientApi.redirect.pathname.indexOf("/me/friends") === 0) {
						try {
							// console.log("new Req")
							const data = await ClientApi.get(API_AVATAR_ROUTE + '/' + payload.pseudo)
							if (addPending)
								addPending({
									pseudo: payload.pseudo,
									avatar: data.avatar ? data.avatar : DefaultImg
								})
						} catch (err) {
							// console.log("err = ", err)
						}
					}
					else {
						if (onNotification)
							onNotification(payload)
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('newRequest')
		}
	}, [socket, pseudo])
}
