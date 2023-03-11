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
import { API_USER_DM } from "../constants/RoutesApi";


export enum MessageStatus {
	SENT,
	LOADING,
	FAILED
}

export interface ChatItem
{
	type: "me" | "other",
	msg: string,
	status: MessageStatus,
	avatar?: string,
}


const DM = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const oldAvatar = useRef<string>()
	const [chatItems, setChatItems] = useState<ChatItem[]>([])
	const [receiver, setReceiver] = useState<IUser | undefined>(undefined);
	const oldReceiverImg = useRef<string>()
	const [discussions, setDiscussions] = useState<Discussion[]>([])






	const addChatItem = (newChatItem: ChatItem) => {
		setChatItems(oldItems => [...oldItems,
			newChatItem
		])
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
		setChatItems([
			{
				type: "me",
				msg: "Hi Timhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnh klcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjb, How are you?",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
			{
				type: "other",
				msg: "I am fine.",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
			{
				type: "other",
				msg: "What about you?",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
			{
				type: "me",
				msg: "Awesome these days.",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
			{
				type: "other",
				msg: "Finally. What's the plan?",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
			{
				type: "me",
				msg: "what plan mate?",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
			{
				type: "other",
				msg: "I'm taliking about the tutorial",
				status: MessageStatus.SENT,
				avatar: undefined,
			},
		])
		setDiscussions([
			{
				pseudo: "Guillaumedu77",
				avatar: undefined,
				unread: 2,
			},
			{
				pseudo: "Leodu69",
				avatar: undefined,
				unread: 3,
			},
			{
				pseudo: "Manondu62",
				avatar: undefined,
				unread: 0,
			},
			{
				pseudo: "AlanTiaCapté",
				avatar: undefined,
				unread: 0,
			},
		])
		if (avatar !== oldAvatar.current || receiver?.avatar !== oldReceiverImg.current) {
			updateImgChatItems([avatar, receiver?.avatar])
			oldAvatar.current = avatar
			oldReceiverImg.current = receiver?.avatar
		}
			
	}, [pseudo, avatar])

	
	useEffect(() => {
		(async () => {
			if (receiver && pseudo) {
				try {
					const { messages }: { messages: IMessage[] } =
						await ClientApi.get(API_USER_DM + '/' + receiver.pseudo)
					const chatItems: ChatItem[] = messages.map(message => ({
						type: (pseudo === message.author) ? "me" : "other",
						msg: message.content,
					 status: MessageStatus.SENT,
						avatar: (pseudo === message.author) ? avatar : receiver.avatar,
					}))
					setChatItems(chatItems)
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [receiver, pseudo])




	return (
		<React.Fragment>
			<Navbar />
			<div className="DM-container">
				<DMList updateReceiver={updateReceiver} discussions={discussions} />
				<DMContent user={{pseudo, avatar}} chatItems={chatItems} receiver={receiver} addChatItem={addChatItem}/>
			</div>
		</React.Fragment>
	)
}

export default DM