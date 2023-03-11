import { useEffect, useRef, useState } from "react";
import "../styles/DMContent.css"
import Avatar from "./Avatar";
import DMItem from "./DMItem";
import avatar from "../img/avatar2.jpeg"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { faCog } from "@fortawesome/free-solid-svg-icons";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import person from "../img/logo3.png"
import { Status } from "../constants/EMessage";
import { ChatItem } from "./DM";
import { IUser } from "../interface/IUser";
import { IoPaperPlaneOutline } from "react-icons/io5"

interface Props {
	user: IUser | undefined,
	receiver: IUser | undefined,
	chatItems: ChatItem[],
	addChatItem: (newChatItem: ChatItem) => void,
}


const DMContent = ({ user, receiver, chatItems, addChatItem }: Props) => {

	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null);
	const msgWritten = useRef<string | null>(null);
	const noMessages = useRef<number>(0)
	



	const handleEnter = () => {
		if (msgWritten.current) {
			
			addChatItem({
				srcImg: user?.avatar,
				type: "me",
				msg: msgWritten.current
			})
			msgWritten.current = ""
			if (inputRef.current)
				inputRef.current.value = ""
		}
	}



	
	/* fait un scroll down max au bon moment */
	useEffect(() => {
		const lastChild: HTMLDivElement | undefined | null = messagesContainerRef.current?.lastChild as HTMLDivElement

		console.log("here 1")
		console.log("messagesContainerRef.current = ", messagesContainerRef.current)
		if (messagesContainerRef.current && lastChild?.previousElementSibling)
		{
			console.log("here 2")
			const previousElementSibling: HTMLDivElement = lastChild.previousElementSibling as HTMLDivElement
			const lowerBottomPoint: number = messagesContainerRef.current.scrollTop + messagesContainerRef.current.scrollHeight
			const lowerTopPoint: number = messagesContainerRef.current?.offsetTop + previousElementSibling.offsetTop
			const scrollBottom: number = messagesContainerRef.current.scrollTop
			+ messagesContainerRef.current.getBoundingClientRect().height;

			if (chatItems.length > noMessages.current)
			{
				console.log("here 3")
				if (scrollBottom >= lowerTopPoint || chatItems.length > 0) {
					console.log("here 4")
					console.log("noMessages.current = ", noMessages.current)
					messagesContainerRef.current?.scrollTo(0, lowerBottomPoint);
				}
			}
			noMessages.current = chatItems.length;
		}
	}, [receiver, chatItems])







	return (
		<div className="main__chatcontent">
			<div className="content__header">
				<div className="blocks">
					<div className="current-chatting-user">
						<Avatar srcImg={receiver?.avatar} />
						<p>AlanTiaCapté</p>
					</div>
				</div>
				<div className="blocks">
					<div className="settings">
						<button className="btn-nobg">
							{/* <FontAwesomeIcon icon={faCog}/> */}
						</button>
					</div>
				</div>
			</div>
			<div className="content__body" ref={messagesContainerRef}>
				{chatItems.map((itm: any, index: number) => {
					return (
						<DMItem
							animationDelay={index + 2}
							sender={itm.type ? itm.type : "me"}
							msg={itm.msg}
							srcImg={itm.image}
						/>
					);
				})}
			</div>
			<div className="content__footer">
				<div className="sendNewMessage">
				<input
					type="text"
					ref={inputRef}
					placeholder="Type a message here..."
					onKeyDown={(e) => e.key === "Enter" && handleEnter()}
					onChange={(e) => msgWritten.current = e.target.value}
				/>
				<button className="btnSendMsg" id="sendMsgBtn" onClick={handleEnter}>
					<IoPaperPlaneOutline className="paper-svg" />
				</button>
				</div>
			</div>
		</div>
	);
}

export default DMContent