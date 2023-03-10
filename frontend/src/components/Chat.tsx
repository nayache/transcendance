import React, { useCallback, useEffect, useRef, useState } from "react";
import '../styles/index.css'
import '../styles/Chat.css'
import ClientApi from "./ClientApi.class";
import { API_BASE_CHAT, API_CHAT_CHANNEL_ROUTE, API_CHAT_MESSAGES_CHANNEL_ROUTE, API_CHAT_USER_CHANNELS_ROUTE, API_PSEUDO_ROUTE, API_SOCKET_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelEvJoin, IChannelEvPunish, IChannelEvLeave, IChannelUser } from "../interface/IChannel";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { IMessage, IOldMessageChannel } from "../interface/IMessage";
import { Socket } from "socket.io-client";
import { ChannelRole, Status } from "../constants/EMessage";
import UserPreview from "./UserPreview";
import { GoGear } from "react-icons/go"
import { AiOutlineWarning } from "react-icons/ai"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu";
import { addMessageBlock, getSecondsRemainingMute, resetMessagesBlock } from "../functions/Chat_utils_messages";
import { handleChange, handleKeyDown } from "../functions/Chat_utils_actions";
import { useMessagesListeners } from "../hooks/useMessagesListeners";
import { AlertType } from "./ChatPage";

interface Props {
	socket?: Socket,
	chanUser: IChannelUser | undefined,
	currentChannelId: number,
	updateChannel: (channel: IChannel) => void,
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	setCurrentChannel: (channelName: string) => void,
	setAlertModal: (alertModal: AlertType, author: IChannelUser,
		channelName: string, target: string) => void,
	channels: IChannel[],
}

export const MAX_CARAC_CHAT: number = 300

const Chat = ({ socket, channels, currentChannelId, removeChannel,
	updateChannel, setCurrentChannel, setAlertModal,
	chanUser }: Props) => {

	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const msg = useRef<string>('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [ doPrintModal, setDoPrintModal ] = useState<boolean>(false)
	const users: IChannelUser[] | null = !(currentChannelId <= -1 || currentChannelId >= channels.length)
	? channels[currentChannelId].users : null
	const [duration, setDuration] = useState<number>()
	const [messages, expiration] = useMessagesListeners(textAreaRef, messagesContainerRef, socket,
	currentChannelId, channels, chanUser, setAlertModal,
	updateChannel, removeChannel, setCurrentChannel)




	const printWarningZone = () => {
		if (duration && duration > 0)
			return (
				<div className="warning-zone-container">
					<AiOutlineWarning className="warning-svg"/>
					<p className="warning-zone-text">
						You are currently muted, try in {duration}sec
					</p>
				</div> 
			)
	}

	const getPage = () => (
		<React.Fragment>
			<div className="chat-container">
				<div className="chat-title-container">
					<h3 className={(() => (
					(currentChannelId <= -1 || currentChannelId >= channels.length) ? "chat-title hidden" : "chat-title"
					))()}>
						{
							!(currentChannelId <= -1 || currentChannelId >= channels.length)
							? channels[currentChannelId].name : 'a'
						} 
						{
							!(currentChannelId <= -1 || currentChannelId >= channels.length)
							&& chanUser?.role === ChannelRole.OWNER
							&& <GoGear className="gear-svg" onClick={() => setDoPrintModal(true)}/>
						}
						{
							!(currentChannelId <= -1 || currentChannelId >= channels.length)
							&& chanUser?.role === ChannelRole.OWNER && doPrintModal &&
							<ModalChannelMenu active={doPrintModal} type={ModalChannelType.EDITCHANNEL}
							channels={channels} currentChannelId={currentChannelId}
							pointedChannelPrv={channels[currentChannelId].prv}
							pointedChannelPassword={channels[currentChannelId].password}
							pointedChannelName={channels[currentChannelId].name}
							chanUser={chanUser}
							callback={() => {console.log("wssshhhhhhhhhhhhhhh"); setDoPrintModal(false)}}
							callbackFail={() => {console.log("onClose modal"); setDoPrintModal(false)}} />
						}
					</h3>
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
					{printWarningZone()}
					<textarea placeholder="Write something..." ref={textAreaRef} className="textarea-text"
					spellCheck={false} maxLength={MAX_CARAC_CHAT}
					onChange={(e) => handleChange(e, textAreaRef, msg)}
					onKeyDown={(e) => handleKeyDown(e, textAreaRef, msg, chanUser, currentChannelId,
					channels, () => {
						if (expiration)
							setDuration(getSecondsRemainingMute(expiration))
					}, () => setDuration(undefined))} />
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