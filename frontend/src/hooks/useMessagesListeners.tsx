import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import { AlertType } from "../components/ChatPage"
import ClientApi from "../components/ClientApi.class"
import { API_CHAT_CHANNEL_ROUTE, API_USER_BLOCK, API_USER_FRIEND_RELATION } from "../constants/RoutesApi"
import { addMessageBlock, addMessageBlockUserBan, addMessageBlockUserGetAdmin, addMessageBlockUserJoin, addMessageBlockUserKick, addMessageBlockUserLeave, addMessageBlockUserMute, addMessageBlockUserMuted, addMessageBlockUserSetAdmin, addMessageBlockUserSetAdminInfo, resetMessagesBlock } from "../functions/Chat_utils_messages"
import { IChannel, IChannelEvJoin, IChannelEvPunish, IChannelEvLeave, IChannelUser } from "../interface/IChannel"
import { IChannelMessage } from "../interface/IChannelMessage"
import { Relation } from "../interface/IUser"
import { useJoinRoomUpdater } from "./useJoinRoomUpdater"
import { useLeaveRoomUpdater } from "./useLeaveRoomUpdater"
import { useMuteUserUpdater } from "./useMuteUserUpdater"
import { usePunishUserUpdater } from "./usePunishUserUpdater"
import { useSetAdminUpdater } from "./useSetAdminUpdater"



export const useMessagesListeners = (
	textAreaRef: React.RefObject<HTMLTextAreaElement>,
	messagesContainerRef: React.RefObject<HTMLDivElement>,
	socket: Socket | undefined, currentChannelId: number, channels: IChannel[],
	chanUser: IChannelUser | undefined,
	setAlertModal: (alertModal: AlertType, author: IChannelUser,
		channelName: string, target: string) => void,
	updateChannel: (channel: IChannel) => void,
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	setCurrentChannel: (channelName: string) => void,
): [JSX.Element[], [string, Date] | undefined] => {

	const [ messages, setMessages ] = useState<JSX.Element[]>([]);
	const oldChannelName = useRef<string | undefined>(!(currentChannelId <= -1 || currentChannelId >= channels.length)
	? channels[currentChannelId].name : undefined)
	const rpseudoSender = useRef<string>('');
	const noMessages = useRef<number>(0);
	const [blockeds, setBlockeds] = useState<string[]>([])
	
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

	usePunishUserUpdater(socket, channels, currentChannelId,
		chanUser, updateChannel, removeChannel, setCurrentChannel,
		(payload) => {
			if (payload.action === "kick") {
				if (payload.target === chanUser?.pseudo)
					setAlertModal(payload.action, payload.author,
						payload.channel, payload.target)
				else 
					setMessages(oldmessages => [...oldmessages,
						addMessageBlockUserKick(payload.author.pseudo, payload.target)
					])
			}
			else if (payload.action === "ban") {
				if (payload.target === chanUser?.pseudo)
					setAlertModal(payload.action, payload.author,
						payload.channel, payload.target)
				else 
					setMessages(oldmessages => [...oldmessages,
						addMessageBlockUserBan(payload.author.pseudo, payload.target)
					])
			}
		}
	)

	const expiration = useMuteUserUpdater(socket, channels, currentChannelId, chanUser,
		(payload) => {
			if (payload.target.pseudo === chanUser?.pseudo)
				setMessages(oldmessages => [...oldmessages,
					addMessageBlockUserMuted(payload.author.pseudo, new Date(payload.expiration))
				])
			else if (payload.author.pseudo === chanUser?.pseudo)
				setMessages(oldmessages => [...oldmessages,
					addMessageBlockUserMute(payload.target.pseudo, new Date(payload.expiration))
				])
		}
	)

	useSetAdminUpdater(socket, chanUser, updateChannel, currentChannelId, channels,
		(payload) => {
			if (payload.target.pseudo === chanUser?.pseudo)
				setMessages(oldmessages => [...oldmessages,
					addMessageBlockUserGetAdmin(payload.author.pseudo)
				])
			else if (payload.author.pseudo === chanUser?.pseudo)
				setMessages(oldmessages => [...oldmessages,
					addMessageBlockUserSetAdmin(payload.target.pseudo)
				])
			else
				setMessages(oldmessages => [...oldmessages,
					addMessageBlockUserSetAdminInfo(payload.author.pseudo, payload.target.pseudo)
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
	

	/* fait un scroll down max au bon moment */
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
				// console.log("oldChannelName.current = ", oldChannelName.current)
				if (scrollBottom >= lowerTopPoint || chanUser?.pseudo === rpseudoSender.current
				|| (messages.length > 0 && oldChannelName.current != channels[currentChannelId].name)) {
					// console.log("noMessages.current = ", noMessages.current)
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
					const { blockeds }: { blockeds: string[] } = await ClientApi
						.get(API_USER_BLOCK)
					channel.messages = channel.messages.filter(message => blockeds.every(blocked => 
						blocked !== message.author))
					noMessages.current = 0
					setBlockeds(blockeds)
					setMessages(resetMessagesBlock(channel.messages))
				}
			} catch (err) {
				// console.log("err = ", err)
			}
		})()
	}, [currentChannelId])

	
	/* ajoute un nouveau message */
	useEffect(() => {
		// console.log("chanUser.pseudo dans useEffect() = ", chanUser?.pseudo)
		if (chanUser?.pseudo && !(currentChannelId <= -1 || currentChannelId >= channels.length))
		{
			// console.log("gonna bind messageRoom")
			// console.log("chanUser.pseudo avant bind = ", chanUser.pseudo)
			socket?.on('messageRoom', async (message: IChannelMessage) => {
				try {
					rpseudoSender.current = message.author;
					// console.log("psuudo       =    ", chanUser.pseudo);
					// console.log("message.channel = ", message.channel);
					// console.log("channels[currentChannelId].name = ", channels[currentChannelId].name);
					const { blockeds }: { blockeds: string[] } = await ClientApi
						.get(API_USER_BLOCK)
					if (blockeds.every(blocked => blocked !== message.author)) {
						if (message.channel === channels[currentChannelId].name)
							setMessages(oldmessages => [...oldmessages,
								addMessageBlock(message)
							])
					}
				} catch (err) {
					// console.log("err pouw updateMessages = ", err)
				}
			})
		}
		return () => {
			// console.log("before debind messageRoom")
			socket?.removeAllListeners("messageRoom");
		}
	}, [socket, chanUser, currentChannelId])
	

	return [messages, expiration]
}
