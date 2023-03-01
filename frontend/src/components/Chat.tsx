import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import '../styles/index.css'
import '../styles/Chat.css'
import ClientApi from "./ClientApi.class";
import { API_CHAT_MESSAGES_CHANNEL_ROUTE, API_CHAT_USER_CHANNELS_ROUTE, API_PSEUDO_ROUTE, API_SOCKET_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IChannel } from "../interface/IChannelUser";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import ServerDownPage from "./ServerDownPage";
import { IMessage } from "../interface/IMessage";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Props {
	socket?: Socket,
	pseudo: string | undefined
}

const MAX_CARAC: number = 300

const Chat = ({ socket, pseudo }: Props) => {

	const { currentChannel } = useSelector((state: RootState) => state.room)
	const rpseudoSender = useRef<string>('');
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const noMessages = useRef<number>(0);
	const [messages, setMessages] = useState<JSX.Element[]>([]);
	const msg = useRef<string>('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);



	const printPreviewProfile = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		
	}, [])

	const updateMessagesBlock = useCallback(({author, message, color}: IMessage) => {
		setMessages(oldmessages => [...oldmessages,
			<div className="message-container">
				<p className="message-text">
					<b className="other_pseudo" style={{color}}>
						<button className="pseudo-button button_without_style" onClick={printPreviewProfile} >
							{author}
						</button>
					</b>
					: {message}
				</p>
			</div>
		])
	}, [])
	
	const isAlphaNumeric = useCallback((str: string): boolean => {
		let code: number;
	
		for (let i = 0, len = str.length; i < len; i++) {
			code = str.charCodeAt(i);
			if (!(code > 47 && code < 58) && // numeric (0-9)
				!(code > 64 && code < 91) && // upper alpha (A-Z)
				!(code > 96 && code < 123)) { // lower alpha (a-z)
				return false;
			}
		}
		return true;
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		msg.current = e.target.value;
		if (textAreaRef.current) // ca a pas trop de sens mais bon..
		{
  			textAreaRef.current.style.height = "";
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
		if (textAreaRef.current &&
			textAreaRef.current.value.length >= MAX_CARAC)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey)
		{
			e.preventDefault()
			try {
				await click();
				msg.current = '';
			} catch (err) {
				console.log("err = ", err);
			}
			if (textAreaRef.current)
			{
				textAreaRef.current.value = "";
				textAreaRef.current.style.height = "";
				textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
			}
		}
	}

	const click = useCallback(async () => {
		if (pseudo)
		{

			console.log("currentChannel?.name = ", currentChannel?.name)
			console.log("msg.current = ", msg.current)
			try {
				await ClientApi.post(API_CHAT_MESSAGES_CHANNEL_ROUTE,
				JSON.stringify({
					target: currentChannel?.name,
					msg: msg.current
				}), 'application/json')
			} catch (err) {
				console.log("err = ", err);
			}
		}
	}, [pseudo, currentChannel?.name])

	const handleMessageRoom = useCallback((message: IMessage) => {
		rpseudoSender.current = message.author;
		console.log("psuudo       =    ", pseudo);
		console.log("message.channel = ", message.channel);
		console.log("currentChannel?.name = ", currentChannel?.name);
		if (message.channel === currentChannel?.name)
			updateMessagesBlock(message);
	}, [currentChannel?.name, pseudo])





	useEffect(() => {
		if (textAreaRef.current) // ca a pas trop de sens mais bon..
		{
  			textAreaRef.current.style.height = "";
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
	}, [])

	useEffect(() => {
		console.log("pseudo dans useEffect() = ", pseudo)
		console.log("currentChannel?.name dans useEffect() = ", currentChannel?.name)
		if (pseudo && currentChannel?.name)
		{
			console.log("gonna bind messageRoom")
			console.log("pseudo avant bind = ", pseudo)
			socket?.on("messageRoom", (message: IMessage) => {
				try {
					rpseudoSender.current = message.author;
					console.log("psuudo       =    ", pseudo);
					console.log("message.channel = ", message.channel);
					console.log("currentChannel?.name = ", currentChannel?.name);
					if (message.channel === currentChannel?.name)
						updateMessagesBlock(message);
				} catch (err) {
					console.log("err pouw updateMessages = ", err)
				}
			})
		}
		return () => {
			console.log("before debind messageRoom")
			socket?.removeAllListeners("messageRoom");
		}
	}, [socket, pseudo, currentChannel?.name])

	useEffect(() => {
		const lastChild: HTMLDivElement | undefined | null = messagesContainerRef.current?.lastChild as HTMLDivElement
		
		if (messagesContainerRef.current && lastChild?.previousElementSibling) {
			const previousElementSibling: HTMLDivElement = lastChild.previousElementSibling as HTMLDivElement
			const lowerBottomPoint: number = messagesContainerRef.current.scrollTop + messagesContainerRef.current.scrollHeight
			const lowerTopPoint: number = messagesContainerRef.current?.offsetTop + previousElementSibling.offsetTop
			const scrollBottom: number = messagesContainerRef.current.scrollTop
			+ messagesContainerRef.current.getBoundingClientRect().height;

			if (messages.length > noMessages.current)
			{
				console.log("scrollBottom = ", scrollBottom)
				if (scrollBottom >= lowerTopPoint || pseudo === rpseudoSender.current)
					messagesContainerRef.current?.scrollTo(0, lowerBottomPoint);
				console.log("lowerTopPoint = ", lowerTopPoint)
				console.log("lowerBottomPoint = ", lowerBottomPoint);
			}
			noMessages.current = messages.length;
		}
	}, [messages])




	const getPage = () => (
		<React.Fragment>
			<div className="chat-container">
				<h3 className={(() => (
					!currentChannel?.name ? "chat-title hidden" : "chat-title"
					))()}>{currentChannel?.name ? currentChannel?.name : 'a'}</h3>
				<div className="messages-container-container">
					<div className="messages-container-bg" />
					<div ref={messagesContainerRef} className="messages-container">
						{ messages }
					</div>
				</div>
				<div className={(() => (
					!currentChannel?.name ? "textarea-text-container hidden" : "textarea-text-container"
					))()}>
					<textarea placeholder="Write something..." ref={textAreaRef} className="textarea-text"
					spellCheck={false} maxLength={MAX_CARAC}
					onChange={handleChange} onKeyDown={handleKeyDown} />
				</div>
			</div>
		</React.Fragment>
	)

	return (
		<React.Fragment>
			{getPage()}
		</React.Fragment>
	)
}

export default Chat;