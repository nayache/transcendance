import React, { useCallback, useEffect, useRef, useState } from "react";
import '../styles/index.css'
import '../styles/Chat.css'
import ClientApi from "./ClientApi.class";
import { API_CHAT_CHANNEL_ROUTE, API_CHAT_MESSAGES_CHANNEL_ROUTE, API_CHAT_USER_CHANNELS_ROUTE, API_PSEUDO_ROUTE, API_SOCKET_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelJoin, IChannelLeave, IChannelUser } from "../interface/IChannelUser";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { IMessage, IOldMessageChannel } from "../interface/IMessage";
import { Socket } from "socket.io-client";
import { ChannelRole, Status } from "../constants/EMessage";
import UserPreview from "./UserPreview";
import { GoGear } from "react-icons/go"

interface Props {
	socket?: Socket,
	chanUser: IChannelUser | undefined,
	currentChannelId: number,
	updateChannel: (channel: IChannel) => void,
	channels: IChannel[],
}

const MAX_CARAC: number = 300

const Chat = ({ socket, channels, currentChannelId, updateChannel, chanUser }: Props) => {

	const rpseudoSender = useRef<string>('');
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const noMessages = useRef<number>(0);
	const [ messages, setMessages ] = useState<JSX.Element[]>([]);
	const msg = useRef<string>('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const users: IChannelUser[] | null = !(currentChannelId <= -1 || currentChannelId >= channels.length)
	? channels[currentChannelId].users : null
	const [ doPrintUserPreview, setDoPrintUserPreview ] = useState<boolean>(false);
	const oldChannelName = useRef<string | undefined>(!(currentChannelId <= -1 || currentChannelId >= channels.length)
	? channels[currentChannelId].name : undefined)




	const resetMessagesBlock = useCallback((messages: IOldMessageChannel[]) => {
		const formattedMessages: JSX.Element[] = messages.map((oldMessage: IOldMessageChannel, i) => (
			<div key={i} className="message-container without-animation">
				{/* <UserPreview /> */}
				<p className="message-text">
					<b className="other_pseudo" style={{color: oldMessage.color}}>
						<button className="pseudo-button button_without_style"
						onClick={() => setDoPrintUserPreview(true)} >
							{oldMessage.author}
						</button>
					</b>
					: {oldMessage.content}
				</p>
			</div>
		))
		noMessages.current = 0;
		setMessages(formattedMessages);
	}, [])

	const updateMessagesBlock = useCallback(({author, message, color}: IMessage) => {
		setMessages(oldmessages => [...oldmessages,
			<div className="message-container">
				<p className="message-text">
					<b className="other_pseudo" style={{color}}>
						<button className="pseudo-button button_without_style"
						onClick={() => setDoPrintUserPreview(true)} >
							{author}
						</button>
					</b>
					: {message}
				</p>
			</div>
		])
	}, [])

	const updateMessagesBlockUserJoin = useCallback(({user: {pseudo: author}}: IChannelJoin) => {
		setMessages(oldmessages => [...oldmessages,
			<div className="event-text-container">
				<p className="event-text">
					<i>
						{author} joined the channel
					</i>
				</p>
			</div>
		])
	}, [])
	
	const updateMessagesBlockUserLeave = useCallback(({pseudo: author}: IChannelLeave) => {
		setMessages(oldmessages => [...oldmessages,
			<div className="event-text-container">
				<p className="event-text">
					<i>
						{author} left the channel
					</i>
				</p>
			</div>
		])
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
		if (chanUser?.pseudo)
		{
			console.log("msg.current = ", msg.current)
			try {
				if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
				&& msg.current.trimEnd().length > 0) {
					await ClientApi.post(API_CHAT_MESSAGES_CHANNEL_ROUTE,
					JSON.stringify({
						target: channels[currentChannelId].name,
						msg: msg.current.trimEnd()
					}), 'application/json')
					msg.current = ""
				}
			} catch (err) {
				console.log("err = ", err);
			}
		}
	}, [chanUser, currentChannelId])





	/* reset la height de l'input */
	useEffect(() => {
		if (textAreaRef.current)
		{
  			textAreaRef.current.style.height = "";
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
	}, [])

	/* remet tous les anciens messages */
	useEffect(() => {
		(async () => {
			try {
				if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {
					const { channel }: { channel: IChannel } = await ClientApi
						.get(API_CHAT_CHANNEL_ROUTE + '/' + channels[currentChannelId].name)
					resetMessagesBlock(channel.messages)
				}
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [currentChannelId])

	useEffect(() => {
		console.log("chanUser.pseudo dans useEffect() = ", chanUser?.pseudo)
		if (chanUser?.pseudo && !(currentChannelId <= -1 || currentChannelId >= channels.length))
		{
			console.log("gonna bind messageRoom")
			console.log("chanUser.pseudo avant bind = ", chanUser.pseudo)
			socket?.on("messageRoom", (message: IMessage) => {
				try {
					rpseudoSender.current = message.author;
					console.log("psuudo       =    ", chanUser.pseudo);
					console.log("message.channel = ", message.channel);
					console.log("channels[currentChannelId].name = ", channels[currentChannelId].name);
					if (message.channel === channels[currentChannelId].name)
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
	}, [socket, chanUser, currentChannelId])
	
	useEffect(() => {
		console.log("chanUser.pseudo dans useEffect du ChannelPart = ", chanUser?.pseudo)
		if (chanUser?.pseudo) {
			socket?.on('joinRoom', (payload: IChannelJoin) => {
				console.log("(join) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.user.pseudo)
				console.log("(join) currentChannelId = ", currentChannelId)
				if (payload.user.pseudo !== chanUser.pseudo && !(currentChannelId <= -1 || currentChannelId >= channels.length)
				&& channels[currentChannelId].name === payload.channel) {
					const users: IChannelUser[] = channels[currentChannelId].users.map(channel => channel)
					if (users.every(user => user.pseudo !== payload.user.pseudo)) // contre les bugs graphiques
						users.push(payload.user)
					const channel: IChannel = {
						name: channels[currentChannelId].name,
						users,
						messages: channels[currentChannelId].messages,
					}
					updateChannel(channel)
					console.log("test ici en join")
					updateMessagesBlockUserJoin(payload)
				}
			})
			socket?.on('leaveRoom', (payload: IChannelLeave) => {
				console.log("(leave) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.pseudo)
				console.log("(leave) currentChannelId = ", currentChannelId)
				if (payload.pseudo !== chanUser.pseudo
				&& !(currentChannelId <= -1 || currentChannelId >= channels.length)
				&& channels[currentChannelId].name === payload.channel) {
					const users: IChannelUser[] = channels[currentChannelId].users
					.filter(user => user.pseudo !== payload.pseudo)
					const channel: IChannel = {
						name: channels[currentChannelId].name,
						users,
						messages: channels[currentChannelId].messages,
					}
					updateChannel(channel)
					console.log("test ici en leave")
					updateMessagesBlockUserLeave(payload)
				}
			})
		}
		return () => {
			socket?.removeAllListeners('joinRoom')
			socket?.removeAllListeners('leaveRoom')
		}
	}, [socket, chanUser, currentChannelId, users])

	useEffect(() => {
		const lastChild: HTMLDivElement | undefined | null = messagesContainerRef.current?.lastChild as HTMLDivElement
		
		if (messagesContainerRef.current && lastChild?.previousElementSibling
		&& !(currentChannelId <= -1 || currentChannelId >= channels.length)) {
			const previousElementSibling: HTMLDivElement = lastChild.previousElementSibling as HTMLDivElement
			const lowerBottomPoint: number = messagesContainerRef.current.scrollTop + messagesContainerRef.current.scrollHeight
			const lowerTopPoint: number = messagesContainerRef.current?.offsetTop + previousElementSibling.offsetTop
			const scrollBottom: number = messagesContainerRef.current.scrollTop
			+ messagesContainerRef.current.getBoundingClientRect().height;

			if (messages.length > noMessages.current)
			{
				console.log("oldChannelName.current = ", oldChannelName.current)
				if (scrollBottom >= lowerTopPoint || chanUser?.pseudo === rpseudoSender.current
				|| oldChannelName.current != channels[currentChannelId].name) {
					console.log("noMessages.current = ", noMessages.current)
					messagesContainerRef.current?.scrollTo(0, lowerBottomPoint);
				}
				oldChannelName.current = channels[currentChannelId].name
			}
			noMessages.current = messages.length;
		}
	}, [chanUser, messages, currentChannelId])





	const getPage = () => (
		<React.Fragment>
			<div className="chat-container">
				<div className="chat-title-container">
					<h3 className={(() => (
					(currentChannelId <= -1 || currentChannelId >= channels.length) ? "chat-title hidden" : "chat-title"
					))()}>
						{!(currentChannelId <= -1 || currentChannelId >= channels.length) ? channels[currentChannelId].name : 'a'}
					</h3>
					<GoGear />
				</div>
				<div className="messages-container-container">
					<div className="messages-container-bg" />
					<div ref={messagesContainerRef} className="messages-container">
						{ messages }
					</div>
				</div>
				<div className={(() => (
					(currentChannelId <= -1 || currentChannelId >= channels.length) ? "textarea-text-container hidden" : "textarea-text-container"
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