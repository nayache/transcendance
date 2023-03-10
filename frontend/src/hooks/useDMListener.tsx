import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { ChatItem, MessageStatus } from "../components/DM"
import { API_CHAT_DISCUSSIONS_RELATION, API_CHAT_MARK_READ } from "../constants/RoutesApi"
import { Discussion, IMessageEvRecv } from "../interface/IMessage"
import { IUser } from "../interface/IUser"

export const useDMListener = (
	socket: Socket | undefined,
	user: IUser | undefined,
	receiver: IUser | undefined,
	updateDiscussions: (pseudo: string, position: number, unread: number, avatar?: string) => void,
	addChatItem?: (chatItem: ChatItem) => void,
) => {

	const unreadNb = useRef<number>(0);
	
	
	useEffect(() => {
		if (user?.pseudo) {
			socket?.on('message', async (payload: IMessageEvRecv) => {
				console.log("(message) user?.pseudo = ", user?.pseudo, " et payload = ", payload)
				console.log("receiver?.pseudo = ", receiver?.pseudo);
				if (ClientApi.redirect.pathname.indexOf("/messages") === 0) {
					if (receiver?.pseudo === payload.author) {
						ClientApi.patch(API_CHAT_MARK_READ)
						if (addChatItem)
							addChatItem({
								avatar: receiver?.avatar,
								type: "other",
								status: MessageStatus.SENT,
								msg: payload.message
							})
					}
					else {
						try {
							const { discussion }: {discussion: Discussion} = await ClientApi.get(API_CHAT_DISCUSSIONS_RELATION + '/' + payload.author)
							if (updateDiscussions)
								updateDiscussions(payload.author, 0, discussion.unread,
									discussion.avatar)
						} catch (err) {
							console.log("err = ", err)
						}
					}
				}
				else {
					//notification
				}
			})
		}
		return () => {
			socket?.removeAllListeners('message')
		}
	}, [socket, user, receiver])
}
