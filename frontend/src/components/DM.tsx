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
import { API_CHAT_DISCUSSIONS_RELATION, API_CHAT_DM, API_CHAT_MARK_READ } from "../constants/RoutesApi";
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
	const oldUser = useRef<IUser>()
	const socket = useSocket()
	const [chatItems, setChatItems] = useState<ChatItem[]>([])
	const [receiver, setReceiver] = useState<IUser | undefined>(undefined);
	const oldReceiver = useRef<IUser>()
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

	const addNewDiscussion = (discussion: Discussion) => {
		setDiscussions(oldDiscussions => {
			const discussions = [...oldDiscussions]
			discussions.unshift(discussion)
			return discussions
		})
	}

	const updateDiscussion = (pseudo: string, unread: number, avatar?: string) => {
		setDiscussions(oldDiscussions => {
			const discussions = [...oldDiscussions]
			if (oldDiscussions.findIndex(discussion => discussion.pseudo === pseudo) === -1) {
				discussions.unshift({
					pseudo,
					avatar,
					unread
				})
				return discussions
			}
			const daDiscussion: Discussion | undefined = oldDiscussions.find(discussion => discussion.pseudo === pseudo)
			if (daDiscussion) {
				daDiscussion.avatar = avatar
				daDiscussion.unread = unread
			}
			return discussions
		})
	}

	const updateDiscussions = (pseudo: string, position: number, unread: number, avatar?: string) => {
		setDiscussions(oldDiscussions => {
			const discussions = [...oldDiscussions]
			if (oldDiscussions.findIndex(discussion => discussion.pseudo === pseudo) === -1) {
				discussions.unshift({
					pseudo,
					avatar,
					unread
				})
				return discussions
			}
			const daDiscussion: Discussion | undefined = oldDiscussions.find(discussion => discussion.pseudo === pseudo)
			const daDiscussionInd: number = oldDiscussions.findIndex((discussion, i) => i === position)
			if (daDiscussion) {
				daDiscussion.avatar = avatar
				daDiscussion.unread = unread
				discussions.splice(position, 0, daDiscussion)
				const daNewDiscussionInd: number = discussions
					.findIndex((discussion) => oldDiscussions[daDiscussionInd].pseudo === discussion.pseudo)
				discussions.splice(daNewDiscussionInd, 1)
			}
			return discussions
		})
	}

	const updateReceiver = (receiver: IUser) => {
		setReceiver(receiver);
	}





	useEffect(() => {
		setUser({pseudo, avatar})
		if (avatar !== oldUser.current?.avatar || receiver?.avatar !== oldReceiver.current?.avatar) {
			updateImgChatItems([avatar, receiver?.avatar])
		}
		return () => {
			oldUser.current = {pseudo, avatar}
			oldReceiver.current = receiver
		}
	}, [pseudo, avatar, receiver])

	useEffect(() => {
		(async () => {
			try {
				if (user?.pseudo && oldUser.current?.pseudo !== user.pseudo) {
					const { discussions: realDiscussions }: { discussions: Discussion[] } = await ClientApi.get(API_CHAT_DISCUSSIONS_RELATION)
					console.log("realDiscussions = ", realDiscussions)
					const discussions: Discussion[] = realDiscussions.map(realDiscussion => realDiscussion);
					setDiscussions(discussions)
					if (discussions.length >= 1)
						updateReceiver({
							pseudo: discussions[0].pseudo,
							avatar: discussions[0].avatar,
						})
				}
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [user])

	
	useEffect(() => {
		(async () => {
			if (receiver && receiver.pseudo !== oldReceiver.current?.pseudo && user?.pseudo) {
				try {
					setChatItems([])
					const { messages }: { messages: IMessage[] } =
						await ClientApi.get(API_CHAT_DM + '/' + receiver.pseudo)
					const chatItems: ChatItem[] = messages.map(message => ({
						type: (user.pseudo === message.author) ? "me" : "other",
						msg: message.content,
						status: MessageStatus.SENT,
						avatar: (user.pseudo === message.author) ? avatar : receiver.avatar,
					}))
					setChatItems(chatItems)
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [receiver, user])

	useEffect(() => {
		if (receiver?.pseudo && receiver.pseudo !== oldReceiver.current?.pseudo) {
			ClientApi.patch(API_CHAT_MARK_READ + '/' + receiver.pseudo)
			updateDiscussion(receiver.pseudo, 0, receiver.avatar)
		}
	}, [receiver])

	useDMListener(socket, user, receiver, updateDiscussions, addChatItem)





	return (
		<React.Fragment>
			<Navbar />
			<div className="DM-container">
				<div className="DM-container-bg" />
				<DMList user={user} updateReceiver={updateReceiver} updateDiscussions={updateDiscussions}
				discussions={discussions} />
				<DMContent socket={socket} user={user} chatItems={chatItems}
				receiver={receiver} addChatItem={addChatItem} updateChatItem={updateChatItem}/>
			</div>
		</React.Fragment>
	)
}

export default DM