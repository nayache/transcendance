import { useEffect } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { ChatItem, MessageStatus } from "../components/DM"
import { IMessageEvRecv } from "../interface/IMessage"
import { IUser } from "../interface/IUser"

export const useDMListener = (
	socket: Socket | undefined,
	user: IUser | undefined,
	receiver: IUser | undefined,
	addChatItem?: (chatItem: ChatItem) => void,
) => {
	
	
	useEffect(() => {
		if (user?.pseudo) {
			socket?.on('message', (payload: IMessageEvRecv) => {
				console.log("(message) user?.pseudo = ", user?.pseudo, " et payload = ", payload)
				if (payload.target === user?.pseudo) {
					if (ClientApi.redirect.pathname.indexOf("/messages") === 0) {
						if (addChatItem)
							addChatItem({
								avatar: receiver?.avatar,
								type: "other",
								status: MessageStatus.SENT,
								msg: payload.message
							})
					}
					else {
						//notification
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('message')
		}
	}, [socket, user])
}
