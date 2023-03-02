import RemoveChannel from "./RemoveChannel"
import '../styles/ChannelPart.css'
import { useEffect, useReducer, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import Channel from "./Channel"
import AddChannel from "./AddChannel"
import { Socket } from "socket.io-client"
import JoinChannel from "./JoinChannel"
import { useDispatch } from "react-redux"
import ClientApi from "./ClientApi.class"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"

export const MAX_CARAC_NAME_CHANNEL: number = 25;
export const MIN_CARAC_NAME_CHANNEL: number = 3;

interface Props {
	socket?: Socket,
	channelNames?: string[],
	pseudo: string | undefined,
}

const ChannelPart = ({ socket, pseudo }: Props) => {

	const { channels } = useSelector((state: RootState) => state.room)
	const [visibleChannels, setVisibleChannels] = useState<string[] | undefined>(
		channels.map(channel => channel.name)
	)
	const dispatch = useDispatch();



	useEffect(() => {
		console.log("visibleChannels = ", visibleChannels)
		setVisibleChannels(channels.map(channel => channel.name))
	}, [channels])

	useEffect(() => {
		console.log("pseudo dans useEffect du ChannelPart = ", pseudo)
		if (pseudo) {
			socket?.on('joinRoom', (payload) => {
				console.log("payload = ", payload)
				// if (author !== pseudo) {
				// }
				// console.log("channelName pour join = ", channelName);
				// setVisibleChannels( channelName)
			})
			socket?.on('leaveRoom', (author: string, channelName: string) => {
				// if (author !== pseudo)
				// 	dispatch(removeChannel(channelName))
				console.log("channelName pour leave = ", channelName);
			})
		}
		return () => {
			socket?.removeAllListeners('joinRoom')
			socket?.removeAllListeners('leaveRoom')
		}
	}, [socket, pseudo,])





	return (
		<div className="channelPart-container">
			<AddChannel pseudo={pseudo} />
			<JoinChannel />
			<RemoveChannel />
			<div>
				{ visibleChannels?.map((visibleChannel) => (
					<Channel channelName={visibleChannel}/>
				)) }
			</div>
		</div>
	)
}

export default ChannelPart