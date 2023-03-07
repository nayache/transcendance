import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { API_CHAT_CHANNEL_LEAVE_ROUTE, API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannelUser"
import { removeChannel, setCurrentChannel, updateChannel } from "../redux/channelsSlice"
import { RootState } from "../redux/store"
import '../styles/Channel.css'
import ClientApi from "./ClientApi.class"
import { FaMinus } from "react-icons/fa"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"
import { useResizeText } from "../hooks/useResizeText"

interface Props {
	chanUser: IChannelUser,
	channelName: string,
}

const Channel = ({ chanUser, channelName }: Props) => {

	const dispatch = useDispatch()
	const { channels, currentChannelId } = useSelector((state: RootState) => state.room)
	const [ doPrintModal, setDoPrintModal ] = useState<boolean>(false)
	const channelTextRef = useResizeText(useRef<HTMLParagraphElement>(null));




	const handleClick = useCallback(async () => {
		try {
			console.log("channels[currentChannelId].name = ", channels[currentChannelId].name, "  channelName = ", channelName)
			if (currentChannelId !== -1 && channels[currentChannelId].name !== channelName) {
				const { channel }: { channel: IChannel } = await ClientApi.get(API_CHAT_CHANNEL_ROUTE + '/' + channelName)
				dispatch(updateChannel(channel))
				dispatch(setCurrentChannel(channelName))
			}
		} catch (err) {
			console.log("err = ", err);
		}
	}, [currentChannelId, dispatch])



	return (
		<div className={(() => {
			if (channelName === channels[currentChannelId].name)
				return ("channel-container selected-channel")
			return ("channel-container")
		})()}>
			<button className="button-channel button_without_style" onClick={handleClick}>
				<div className="channel-text">                              
					<p ref={channelTextRef}>{channelName}</p>
				</div>
			</button>
			{channelName !== 'General' && <FaMinus onClick={() => setDoPrintModal(true)} className="minus-svg" />}
			<ModalChannelMenu active={doPrintModal} pointedChannelName={channelName}
			chanUser={chanUser} type={ModalChannelType.LEAVECHANNEL}
			callback={() => {console.log("wssshhhhhhhhhhhhhhh"); setDoPrintModal(false)}} callbackFail={() => setDoPrintModal(false)} />
		</div>
	)
}

export default Channel;