import React, { useEffect, useState, useRef } from "react";
import { useAvatar } from "../hooks/useAvatar";
import { usePseudo } from "../hooks/usePseudo";
import { IUser } from "../interface/IUser";
import "../styles/DM.css"
import DMContent from "./DMContent";
import DMList from "./DMList";
import UserProfileChat from "./DMUserProfile";
import Navbar from "./Navbar";


export interface ChatItem
{
	srcImg?: string,
	type: "me" | "other",
	msg: string,
}


const DM = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const oldAvatar = useRef<string>()
	const [chatItems, setChatItems] = useState<ChatItem[]>([])
	const [receiver, setReceiver] = useState<IUser | undefined>(undefined);
	const oldReceiverImg = useRef<string>()






	const addChatItem = (newChatItem: ChatItem) => {
		setChatItems(oldItems => [...oldItems,
			newChatItem
		])
	}

	const updateImgChatItems = ([userImg, receiverImg]: [string?, string?]) => {
		setChatItems(oldChatItems => oldChatItems.map(oldChatItem => {
			if (oldChatItem.type === 'me') {
				oldChatItem.srcImg = userImg;
				return oldChatItem;
			}
			else if (oldChatItem.type === "other") {
				oldChatItem.srcImg = receiverImg;
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
				srcImg: undefined,
				type: "me",
				msg: "Hi Timhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnh klcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjb, How are you?",
			},
			{
				srcImg: undefined,
				type: "other",
				msg: "I am fine.",
			},
			{
				srcImg: undefined,
				type: "other",
				msg: "What about you?",
			},
			{
				srcImg: undefined,
				type: "me",
				msg: "Awesome these days.",
			},
			{
				srcImg: undefined,
				type: "other",
				msg: "Finally. What's the plan?",
			},
			{
				srcImg: undefined,
				type: "me",
				msg: "what plan mate?",
			},
			{
				srcImg: undefined,
				type: "other",
				msg: "I'm taliking about the tutorial",
			},
		])
		if (avatar !== oldAvatar.current || receiver?.avatar !== oldReceiverImg.current) {
			updateImgChatItems([avatar, receiver?.avatar])
			oldAvatar.current = avatar
			oldReceiverImg.current = receiver?.avatar
		}
			
	}, [pseudo, avatar])





	return (
		<React.Fragment>
			<Navbar />
			<div className="DM-container">
				<DMList updateReceiver={updateReceiver} />
				<DMContent user={{pseudo, avatar}} chatItems={chatItems} receiver={receiver} addChatItem={addChatItem}/>
			</div>
		</React.Fragment>
	)
}

export default DM