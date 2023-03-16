import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { Friend, Pending } from "../components/Friends"
import { API_USER_BLOCK } from "../constants/RoutesApi"
import { IFriendEv } from "../interface/IFriend"

export const useFriendListener = (
	socket: Socket | undefined,
	pseudo: string | undefined,
	addFriend?: (friend: Friend) => void,
	addPending?: (pending: Pending) => void,
) => {	
	
	useEffect(() => {
		if (pseudo) {
			socket?.on('newRequest', async (payload: IFriendEv) => {
				console.log("(newRequest) pseudo = ", pseudo, " et payload = ", payload)
				const data: { blockeds: string[] } = await ClientApi.get(API_USER_BLOCK);
				const isBlocked: boolean = data.blockeds.some(blocked => 
					blocked === payload.pseudo )
				if (!isBlocked)
				{
					if (ClientApi.redirect.pathname.indexOf("/friends") === 0) {
						
					}
					else {
						//notification
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('newRequest')
		}
	}, [socket, pseudo])
}
