import React, { useCallback, useEffect, useRef, useState } from "react"
import { API_CHAT_CHANNEL_LEAVE_ROUTE, API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import '../styles/Channel.css'
import ClientApi from "./ClientApi.class"
import { FaMinus } from "react-icons/fa"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"
import { useResizeText } from "../hooks/useResizeText"

interface Props {
	chanUser: IChannelUser,
	channelName: string,
	currentChannelId: number,
	channels: IChannel[],
	addChannel: (channel: IChannel) => void,
	updateChannel: (channel: IChannel) => void,	
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	setCurrentChannel: (channelName: string) => void,
}

const Channel = ({ chanUser, channelName, currentChannelId, addChannel, removeChannel,
	updateChannel, setCurrentChannel, channels }: Props) => {

	const [ doPrintModal, setDoPrintModal ] = useState<boolean>(false)
	const channelTextRef = useResizeText(useRef<HTMLParagraphElement>(null));




	const handleClick = useCallback(async () => {
		try {
			if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
			&& channels[currentChannelId].name !== channelName) {
				const { channel }: { channel: IChannel } = await ClientApi.get(API_CHAT_CHANNEL_ROUTE + '/' + channelName)
				console.log("channels[currentChannelId].name = ", channels[currentChannelId].name, "  channelName = ", channelName)
				updateChannel(channel)
			}
			setCurrentChannel(channelName)
		} catch (err) {
			console.log("err = ", err);
		}
	}, [currentChannelId, updateChannel, setCurrentChannel,])



	return (
		<div className={(() => {
			if (!(currentChannelId <= -1 || currentChannelId >= channels.length) && channelName === channels[currentChannelId].name)
				return ("channel-container selected-channel")
			return ("channel-container")
		})()}>
			<button className="button-channel button_without_style" onClick={handleClick}>
				<div className="channel-text-container">                              
					<p className="channel-text" ref={channelTextRef}>{channelName}</p>
				</div>
			</button>
			{channelName !== 'General' && <FaMinus onClick={() => setDoPrintModal(true)} className="minus-svg" />}
			<ModalChannelMenu active={doPrintModal} type={ModalChannelType.LEAVECHANNEL}
			channels={channels} currentChannelId={currentChannelId} addChannel={addChannel}
			removeChannel={removeChannel} setCurrentChannel={setCurrentChannel}
			updateChannel={updateChannel} pointedChannelName={channelName}
			chanUser={chanUser}
			callback={() => {console.log("wssshhhhhhhhhhhhhhh"); setDoPrintModal(false)}}
			callbackFail={() => setDoPrintModal(false)} />
		</div>
	)
}

export default Channel;