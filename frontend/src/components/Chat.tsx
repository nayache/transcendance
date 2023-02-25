import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import '../styles/Chat.css'
import { useSocket } from "../hooks/useSocket";
import ClientApi from "./ClientApi.class";
import { API_CHAT_MESSAGES_CHANNEL_ROUTE, API_CHAT_USER_CHANNELS_ROUTE, API_PSEUDO_ROUTE, API_SOCKET_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IChannel } from "../interface/IChannelUser";
import { AboutErr, IError, TypeErr } from "../constants/error_constants";
import ServerDownPage from "./ServerDownPage";

const MAX_CARAC: number = 300

const Chat = () => {

	const socket = useSocket(API_SOCKET_URL,
		{ auth: {token: `Bearer ${ClientApi.token}`} });
	const rpseudoSender = useRef<string>('');
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const noMessages = useRef<number>(0);
	const [messages, setMessages] = useState<JSX.Element[]>([]);
	const msg = useRef<string>('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [roomNames, setRoomNames] = useState<string[]>([ 'General' ]);
	const [currentRoomName, setCurrentRoomName] = useState<string>('General');
	const [isOkay, setIsOkay] = useState<boolean>();
	const [pseudo, setPseudo] = useState<string>();


	const printPreviewProfile = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

	}, [])

	const updateMessagesBlock = useCallback((pseudoSender: string, message: string) => {
		setMessages(oldmessages => [...oldmessages,
			<div className="message-container">
				<p className="message-text">
					<b className="other_pseudo">
						<button className="pseudo-button" onClick={printPreviewProfile} >
							{pseudoSender}
						</button>
					</b>
					: {message}
				</p>
			</div>
		])
	}, [])

	const updateRooms = useCallback(async () => {
		try {
			const data = await ClientApi.get(API_CHAT_USER_CHANNELS_ROUTE)
			const { channels } = data;
			console.log("channels = ", channels)
			const newRoomNames: string[] = [ 'General' ];
			channels.map((channel: IChannel) => {
				newRoomNames.push(channel.name);
			})
			setRoomNames(newRoomNames);
		} catch (err) {
			console.log("err = ", err);
		}
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
				textAreaRef.current.value = ""
				textAreaRef.current.style.height = "";
				textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
			}
		}
	}

	const click = useCallback(async () => {
		if (pseudo)
		{

			console.log("currentRoomName = ", currentRoomName)
			console.log("msg.current = ", msg.current)
			try {
				await ClientApi.post(API_CHAT_MESSAGES_CHANNEL_ROUTE, JSON.stringify({
					target: currentRoomName,
					msg: msg.current.trim()
				}), 'application/json')
			} catch (err) {
				console.log("err = ", err);
			}
		}
	}, [pseudo, currentRoomName])



	//creer des hook pour les socket.on (je crois)
	socket?.on("messageRoom", (pseudoSender, message) => {
		rpseudoSender.current = pseudoSender;
		updateMessagesBlock(pseudoSender, message);
	})



	useEffect(() => {
		if (textAreaRef.current) // ca a pas trop de sens mais bon..
		{
  			textAreaRef.current.style.height = "";
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
	}, [])

    useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_PSEUDO_ROUTE)
				console.log("data.pseudo = ", data.pseudo)
				setPseudo(data.pseudo)
				console.log("pseudo = ", pseudo)
				if (pseudo)
					setIsOkay(true);
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setIsOkay(false)
				else if (_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND )
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudo])

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
		<div>
			<Navbar />
			<div className="chat-container">
				<div className="messages-container-container">
					<div className="messages-container-bg" />
					<div ref={messagesContainerRef} className="messages-container">
						{ messages }
					</div>
				</div>
				<div className="textarea-text-container">
					<textarea placeholder="Write something..." ref={textAreaRef} className="textarea-text"
					spellCheck={false} maxLength={MAX_CARAC}
					onChange={handleChange} onKeyDown={handleKeyDown} />
				</div>
				<div className="buttons-container">
					<div>
						{ roomNames.map((roomName: string) => (
							<button>{ roomName }</button>
						)) }
					</div>
				</div>
			</div>
		</div>
	)

	return (
		<React.Fragment>
			{isOkay && getPage()}
			{isOkay == false && <ServerDownPage />}
		</React.Fragment>
	)
}

export default Chat;