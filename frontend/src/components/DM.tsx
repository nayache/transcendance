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
import { API_AVATAR_ROUTE, API_CHAT_DISCUSSIONS_RELATION, API_CHAT_DM, API_CHAT_MARK_READ, API_GAME_ACCEPT, API_USER_BLOCK, GAMEPAGE_ROUTE, MESSAGES_ROUTE } from "../constants/RoutesApi";
import { useSocket } from "../hooks/useSocket";
import { useDMListener } from "../hooks/useDMListener";
import { useParams } from "react-router-dom";
import { AboutErr, IError } from "../constants/EError";
import { IGameInviteEv } from "../interface/IGame";
import { useInviteGame } from "../hooks/useInviteGame";
import ModalGameMenu, { ModalGameType } from "./ModalGameMenu";



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
	const [user, setUser] = useState<IUser | undefined>(undefined);
	const oldUser = useRef<IUser>()
	const socket = useSocket()
	const [chatItems, setChatItems] = useState<ChatItem[]>([])
	const pseudoParam = useParams().pseudo;
	const [receiver, setReceiver] = useState<IUser | undefined>(undefined);
	const oldReceiver = useRef<IUser>()
	const [discussions, setDiscussions] = useState<Discussion[]>([])
	const [avatar, setAvatar] = useState<string | undefined>(undefined)
	const [modalGameType, setModalGameType] = useState<ModalGameType | null>(null)
	const inviteInfos = useRef<IGameInviteEv | null>(null)
	






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
			const daDiscussionInd: number = oldDiscussions.findIndex(discussion => discussion.pseudo === pseudo)
			if (daDiscussion) {
				daDiscussion.avatar = avatar
				daDiscussion.unread = unread
				console.log("discussions (avant le bail) = ", discussions.map(discussion => discussion))
				discussions.splice(position, 0, daDiscussion)
				console.log("discussions (apres le bail) = ", discussions.map(discussion => discussion))
				console.log("oldDisucssions (apres le bail) = ", oldDiscussions)
				console.log("daDiscussionInd = ", daDiscussionInd)
				console.log("position = ", position)
				const daNewDiscussionInd: number = daDiscussionInd > position ? daDiscussionInd + 1 : daDiscussionInd
				console.log("daNewDiscussionInd = ", daNewDiscussionInd)
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
				if (pseudo) {
					const data = await ClientApi.get(API_AVATAR_ROUTE)
					console.log("data.avatar = ", data.avatar)
					setAvatar(data.avatar)
					console.log("avatar = ", avatar)
				}
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setAvatar(undefined)
			}
		})()
    }, [avatar, pseudo])
	
	useEffect(() => {
		(async () => {
			try {
				console.log("user = ", user)
				console.log("oldUser = ", oldUser)
				if (user?.pseudo && oldUser.current?.pseudo !== user.pseudo) {
					const { discussions: notrealDiscussions }: { discussions: Discussion[] } =
						await ClientApi.get(API_CHAT_DISCUSSIONS_RELATION);
					const data: { blockeds: string[] } = await ClientApi.get(API_USER_BLOCK); 
					const realDiscussions = notrealDiscussions.filter(discussion => data.blockeds.every(blocked => discussion.pseudo !== blocked))
					if (pseudoParam) {
						try {
							console.log("realDiscussions = ", realDiscussions)
							const {avatar: avatarParam} = await ClientApi.get(API_AVATAR_ROUTE + '/' + pseudoParam)
							const discussions: Discussion[] = realDiscussions.map(discussion => discussion).reverse()
							console.log("--------- avatarParam ----------- = ", avatarParam)
							console.log("discussions = ", discussions)
							if (discussions.findIndex(discussion => discussion.pseudo === pseudoParam) === -1) {
								discussions.unshift({
									pseudo: pseudoParam,
									avatar: avatarParam,
									unread: 0
								})
							} else {
								const daDiscussion: Discussion | undefined = discussions.find(discussion => discussion.pseudo === pseudoParam)
								const daDiscussionInd: number = discussions.findIndex(discussion => discussion.pseudo === pseudoParam)
								if (daDiscussion) {
									daDiscussion.avatar = avatarParam
									daDiscussion.unread = 0
									discussions.splice(0, 0, daDiscussion)
									const daNewDiscussionInd: number = daDiscussionInd > 0 ? daDiscussionInd + 1 : daDiscussionInd
									console.log("daNewDiscussionInd = ", daNewDiscussionInd)
									discussions.splice(daNewDiscussionInd, 1)
								}
							}
							setDiscussions(discussions)
							updateReceiver({
								pseudo: pseudoParam,
								avatar: avatarParam,
							})
						} catch (err) {
							console.log("realDiscussions = ", realDiscussions)
							const discussions: Discussion[] = realDiscussions.map(realDiscussion => realDiscussion);
							setDiscussions(discussions)
							if (discussions.length >= 1)
								updateReceiver({
									pseudo: discussions[0].pseudo,
									avatar: discussions[0].avatar,
								})
						}
					}
					else {
						console.log("realDiscussions = ", realDiscussions)
						const discussions: Discussion[] = realDiscussions.map(realDiscussion => realDiscussion);
						setDiscussions(discussions)
						if (discussions.length >= 1)
							updateReceiver({
								pseudo: discussions[0].pseudo,
								avatar: discussions[0].avatar,
							})
					}
				}
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [user, pseudoParam])
	
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
		console.log("(useEffect) receiver?.pseudo = ", receiver?.pseudo)
		console.log("(useEffect) oldReceiver.current?.pseudo = ", oldReceiver.current?.pseudo)
		if (receiver?.pseudo && receiver.pseudo !== oldReceiver.current?.pseudo) {
			console.log("(useEffect) yo")
			ClientApi.patch(API_CHAT_MARK_READ + '/' + receiver.pseudo)
			updateDiscussion(receiver.pseudo, 0, receiver.avatar)
		}
	}, [receiver])

	useDMListener(socket, user, receiver, updateDiscussions, addChatItem)

	useInviteGame(socket, (data: IGameInviteEv) => {
		inviteInfos.current = {
			author: data.author,
			invited: data.invited,
			difficulty: data.difficulty
		}
		console.log("inviteInfos.current = ", inviteInfos.current)
		console.log("data = ", data)
		setModalGameType(ModalGameType.INVITED)
	})





	return (
		<React.Fragment>
			<Navbar />
			{ modalGameType !== null && inviteInfos.current &&
				<ModalGameMenu active={modalGameType !== null} type={modalGameType}
				pseudo={pseudo} author={inviteInfos.current.author} difficulty={inviteInfos.current.difficulty}
				callback={async () => {
					try {
						if (inviteInfos.current) {
							ClientApi.redirect = new URL(GAMEPAGE_ROUTE + '/' + inviteInfos.current.difficulty + '/fromAccept/' + inviteInfos.current.author)
						}
					}
					catch (err) {
						console.log("err = ", err)
					}
					setModalGameType(null)
				}}
				callbackFail={({author}) => {
					try {
						if (author) {
							ClientApi.post(API_GAME_ACCEPT, JSON.stringify({
								target: author,
								response: false
							}), 'application/json')
						}
					}
					catch (err) {
						console.log("err = ", err)
					}
					setModalGameType(null)
				}}
				/>
			}
			<div className="DM-container">
				<div className="DM-container-bg" />
				<DMList user={user} updateReceiver={updateReceiver} updateDiscussions={updateDiscussions}
				discussions={discussions} />
				<DMContent socket={socket} user={user} chatItems={chatItems}
				receiver={receiver} addChatItem={addChatItem} updateChatItem={updateChatItem}
				updateDiscussions={updateDiscussions}/>
			</div>
		</React.Fragment>
	)
}

export default DM