import React, { useCallback } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { IChannel } from "../interface/IChannelUser"
import { setCurrentChannel, updateChannel } from "../redux/channelsSlice"
import { RootState } from "../redux/store"
import ClientApi from "./ClientApi.class"

interface Props {
	channelName: string,
}

const Channel = ({ channelName }: Props) => {

	const dispatch = useDispatch()
	const { channels, currentChannelId } = useSelector((state: RootState) => state.room)

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
		<div>
			<button onClick={handleClick}>{channelName}</button>
		</div>
	)
}

export default Channel;