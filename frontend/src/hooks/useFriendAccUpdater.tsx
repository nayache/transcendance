import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { Friend, Pending } from "../components/Friends"
import { Status } from "../constants/EMessage"
import { API_AVATAR_ROUTE, API_USER_BLOCK } from "../constants/RoutesApi"
import { IFriendEv } from "../interface/IFriend"

export const useNewFriendAccListener = (
	socket: Socket | undefined,
	pseudo: string | undefined,
	addFriend?: (friend: Friend) => void,
	onNotification?: (payload?: IFriendEv) => void
) => {	
	
	useEffect(() => {
		if (pseudo) {
			socket?.on('acceptedRequest', async (payload: IFriendEv) => {
				console.log("(acceptedRequest) pseudo = ", pseudo, " et payload = ", payload)
				const data: { blockeds: string[] } = await ClientApi.get(API_USER_BLOCK);
				const isBlocked: boolean = data.blockeds.some(blocked => 
					blocked === payload.pseudo )
				if (!isBlocked)
				{
					if (ClientApi.redirect.pathname.indexOf("/friends") === 0) {
						try {
							const data = await ClientApi.get(API_AVATAR_ROUTE + '/' + payload.pseudo)
							if (addFriend)
								addFriend({
									pseudo: payload.pseudo,
									avatar: data.avatar,
									status: Status.OFFLINE
								})
						} catch (err) {
							console.log("err = ", err)
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
			socket?.removeAllListeners('acceptedRequest')
		}
	}, [socket, pseudo])
}
