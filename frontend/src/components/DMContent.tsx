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
import { ChatItem, MessageStatus } from "./DM";
import { IUser } from "../interface/IUser";
import { IoPaperPlaneOutline } from "react-icons/io5"
import { IError } from "../constants/EError";
import ClientApi from "./ClientApi.class";
import { API_USER_DM } from "../constants/RoutesApi";
import { useDMListener } from "../hooks/useDMListener";
import { Socket } from "socket.io-client";

interface Props {
	socket?: Socket,
	user: IUser | undefined,
	receiver: IUser | undefined,
	chatItems: ChatItem[],
	addChatItem: (newChatItem: ChatItem) => void,
	updateChatItem: (id: number, updateChatItem: ChatItem) => void,
}


const DMContent = ({ socket, user, receiver, chatItems, addChatItem, updateChatItem }: Props) => {

	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null);
	const msgWritten = useRef<string | null>(null);
	const noMessages = useRef<number>(0)
	const currMsgId = useRef<number>(0)
	


	const addLocalMsg = (id: number, msg: string) => {
		addChatItem({
			avatar: user?.avatar,
			id,
			type: "me",
			status: MessageStatus.LOADING,
			msg
		})
		return ++id;
	}

	const realPushMsg = async (id: number, msg: string) => {
		try {
			console.log("receiver?.pseudo ? receiver?.pseudo : null = ", receiver?.pseudo ? receiver?.pseudo : null)
			const { id: _id } = await ClientApi.post(API_USER_DM, JSON.stringify({
				target: receiver?.pseudo ? receiver?.pseudo : null,
				msg: msg,
				id
			}), 'application/json')
			id = _id
			console.log("ici l'id vaut ", id)
			updateChatItem(id, {
				avatar: user?.avatar,
				id: id++,
				type: "me",
				status: MessageStatus.SENT,
				msg: msg
			})
		} catch (err) {
			const _error: IError = err as IError

			console.log("err = ", err)
			updateChatItem(id, {
				avatar: user?.avatar,
				id,
				type: "me",
				status: MessageStatus.FAIL,
				msg: msg
			})
		}
		return id
	}

	const handleEnter = async () => {
		if (inputRef.current)
			inputRef.current.value = ""
		if (msgWritten.current) {
			try {
				console.log("receiver?.pseudo ? receiver?.pseudo : null = ", receiver?.pseudo ? receiver?.pseudo : null)
				await ClientApi.post(API_USER_DM, JSON.stringify({
					target: receiver?.pseudo ? receiver?.pseudo : null,
					msg: msgWritten.current,
				}), 'application/json')
				addChatItem({
					avatar: user?.avatar,
					type: "me",
					status: MessageStatus.SENT,
					msg: msgWritten.current
				})
			} catch (err) {
				const _error: IError = err as IError
	
				console.log("err = ", err)
				addChatItem({
					avatar: user?.avatar,
					type: "me",
					status: MessageStatus.FAIL,
					msg: msgWritten.current
				})
			}
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

			if (scrollBottom >= lowerTopPoint || chatItems.length > 0) {
				console.log("here 4")
				console.log("noMessages.current = ", noMessages.current)
				messagesContainerRef.current?.scrollTo(0, lowerBottomPoint);
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
						<p>{receiver?.pseudo}</p>
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
				{chatItems.map((itm, index) => {
					return (
						<DMItem
							key={index}
							animationDelay={index + 2}
							chatItem={itm}
							tryAgain={() => {
								updateChatItem(currMsgId.current, {
									avatar: user?.avatar,
									id: itm.id,
									type: "me",
									status: MessageStatus.LOADING,
									msg: itm.msg
								})
								console.log("itm.id = ", itm.id)
								if (itm.id)
									realPushMsg(itm.id, itm.msg)
							}}
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