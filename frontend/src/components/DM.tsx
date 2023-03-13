import React, { useEffect, useState, useRef } from "react";
import { useAvatar } from "../hooks/useAvatar";
import { usePseudo } from "../hooks/usePseudo";
import { Discussion } from "../interface/IMessage";
import { IUser } from "../interface/IUser";
import { IMessage } from "../interface/IMessage"
import "../styles/DM.css"
import ClientApi from "./ClientApi.class";
import DMContent from "./DMContent";
import DMList from "./DMList";
import UserProfileChat from "./DMUserProfile";
import Navbar from "./Navbar";
import { API_USER_DISCUSSIONS_RELATION, API_USER_DM } from "../constants/RoutesApi";
import { useSocket } from "../hooks/useSocket";
import { useDMListener } from "../hooks/useDMListener";


export enum MessageStatus {
	SENT,
	LOADING,
	FAIL
}

export interface ChatItem
{
	type: "me" | "other",
	id?: number,
	msg: string,
	status: MessageStatus,
	avatar?: string,
}


const DM = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const [user, setUser] = useState<IUser | undefined>(undefined);
	const oldAvatar = useRef<string>()
	const socket = useSocket()
	const [chatItems, setChatItems] = useState<ChatItem[]>([])
	const [receiver, setReceiver] = useState<IUser | undefined>(undefined);
	const oldReceiverImg = useRef<string>()
	const [discussions, setDiscussions] = useState<Discussion[]>([])






	const addChatItem = (newChatItem: ChatItem) => {
		setChatItems(oldItems => [...oldItems,
			newChatItem
		])
	}

	const updateChatItem = (id: number, updatedChatItem: ChatItem) => {
		setChatItems(oldItems => oldItems.map(oldItem => {
			if (oldItem.id === id)
				return (updatedChatItem)
			return (oldItem)
		}))
	}

	const updateImgChatItems = ([userImg, receiverImg]: [string?, string?]) => {
		setChatItems(oldChatItems => oldChatItems.map(oldChatItem => {
			if (oldChatItem.type === 'me') {
				oldChatItem.avatar = userImg;
				return oldChatItem;
			}
			else if (oldChatItem.type === "other") {
				oldChatItem.avatar = receiverImg;
				return oldChatItem;
			}
			return oldChatItem;
		}))
	}

	const updateReceiver = (receiver: IUser) => {
		setReceiver(receiver);
	}




	useEffect(() => {
		setUser({pseudo, avatar})
		if (avatar !== oldAvatar.current || receiver?.avatar !== oldReceiverImg.current) {
			updateImgChatItems([avatar, receiver?.avatar])
			oldAvatar.current = avatar
			oldReceiverImg.current = receiver?.avatar
		}
	}, [pseudo, avatar])

	useEffect(() => {
		(async () => {
			try {
				if (user?.pseudo) {
					const { discussions }: { discussions: Discussion[] } = await ClientApi.get(API_USER_DISCUSSIONS_RELATION)
					setDiscussions(discussions)
				}
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [user])

	
	useEffect(() => {
		(async () => {
			if (receiver && user?.pseudo) {
				try {
					setChatItems([])
					const { messages }: { messages: IMessage[] } =
						await ClientApi.get(API_USER_DM + '/' + receiver.pseudo)
					const chatItems: ChatItem[] = messages.map(message => ({
						type: (user?.pseudo === message.author) ? "me" : "other",
						msg: message.content,
					 status: MessageStatus.SENT,
						avatar: (user?.pseudo === message.author) ? avatar : receiver.avatar,
					}))
					setChatItems(chatItems)
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [receiver, user])

	useDMListener(socket, user, receiver, addChatItem)





	return (
		<React.Fragment>
			<Navbar />
			<div className="DM-container">
				<DMList user={user} updateReceiver={updateReceiver} discussions={discussions} />
				<DMContent socket={socket} user={user} chatItems={chatItems}
				receiver={receiver} addChatItem={addChatItem} updateChatItem={updateChatItem}/>
			</div>
		</React.Fragment>
	)
}

export default DM