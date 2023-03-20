import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { Friend, Pending } from "../components/Friends"
import { Status } from "../constants/EMessage"
import { API_AVATAR_ROUTE, API_USER_BLOCK, API_USER_FRIENDS_LIST } from "../constants/RoutesApi"
import { IFriendEv } from "../interface/IFriend"
import DefaultImg from "../img/avatar2.jpeg"

export const useNewFriendAccListener = (
	socket: Socket | undefined,
	pseudo: string | undefined,
	setFriends?: (friends: Friend[]) => void,
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
					if (ClientApi.redirect.pathname.indexOf("/me/friends") === 0) {
						try {
							const data = await ClientApi.get(API_USER_FRIENDS_LIST)
							if (setFriends)
								setFriends(data.friends)
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
