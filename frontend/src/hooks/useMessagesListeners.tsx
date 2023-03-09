import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { addMessageBlock, addMessageBlockUserJoin, addMessageBlockUserLeave, resetMessagesBlock } from "../functions/Chat_utils_messages"
import { IChannel, IChannelJoin, IChannelKick, IChannelLeave, IChannelUser } from "../interface/IChannelUser"
import { IMessage } from "../interface/IMessage"
import { useJoinRoomUpdater } from "./useJoinRoomUpdater"
import { useLeaveRoomUpdater } from "./useLeaveRoomUpdater"



export const useMessagesListeners = (
	textAreaRef: React.RefObject<HTMLTextAreaElement>,
	messagesContainerRef: React.RefObject<HTMLDivElement>,
	socket: Socket | undefined, currentChannelId: number, channels: IChannel[],
	chanUser: IChannelUser | undefined,
	updateChannel: (channel: IChannel) => void,
) => {

	const [ messages, setMessages ] = useState<JSX.Element[]>([]);
	const oldChannelName = useRef<string | undefined>(!(currentChannelId <= -1 || currentChannelId >= channels.length)
	? channels[currentChannelId].name : undefined)
	const rpseudoSender = useRef<string>('');
	const noMessages = useRef<number>(0);
	
	useJoinRoomUpdater(socket, chanUser, updateChannel, currentChannelId, channels,
		(payload) => {
			setMessages(oldmessages => [...oldmessages,
				addMessageBlockUserJoin(payload.user.pseudo)
			])
		}
	)
	useLeaveRoomUpdater(socket, chanUser, updateChannel, currentChannelId, channels,
		(payload) => {
			setMessages(oldmessages => [...oldmessages,
				addMessageBlockUserLeave(payload.pseudo)
			])
		}
	)



	/* reset la height de l'input */
	useEffect(() => {
		if (textAreaRef.current && textAreaRef.current.textContent === "")
		{
  			textAreaRef.current.style.height = "";
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
	}, [textAreaRef])
	


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


	/* remet tous les anciens messages */
	useEffect(() => {
		(async () => {
			try {
				if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {
					const { channel }: { channel: IChannel } = await ClientApi
						.get(API_CHAT_CHANNEL_ROUTE + '/' + channels[currentChannelId].name)
					noMessages.current = 0
					setMessages(resetMessagesBlock(channel.messages))
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
					setMessages(oldmessages => [...oldmessages,
						addMessageBlock(message)
					])
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
	

	return messages
}
