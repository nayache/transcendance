import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_LEAVE_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannelUser"
import { removeChannel, setCurrentChannel, updateChannel } from "../redux/channelsSlice"
import { RootState } from "../redux/store"
import ClientApi from "./ClientApi.class"
import '../styles/LeaveChannelMenu.css'

interface Props {
	channelName: string
	chanUser: IChannelUser,
	onLeave?: () => void,
	onLeaveFail?: () => void,
}

export const LeaveChannelMenu = ({ channelName, onLeave, onLeaveFail }: Props) => {


	const { channels, currentChannelId } = useSelector((state: RootState) => state.room)
	const [isFinished, setIsFinished] = useState<boolean>(false);
	const dispatch = useDispatch()




	const click = async () => {
		try {
			const currentChannelName: string = channels[currentChannelId].name;
			const { channel }: { channel: IChannel } = await ClientApi.patch(API_CHAT_CHANNEL_LEAVE_ROUTE, JSON.stringify({
				name: channelName
			}), 'application/json')
			dispatch(removeChannel(channelName))
			dispatch(updateChannel(channel))
			if (currentChannelName === channelName)
				dispatch(setCurrentChannel('General'))
			setIsFinished(true)
		} catch (err) {
			console.log("err = ", err);
			if (onLeaveFail)
				onLeaveFail()
		}
	}



	useEffect(() => {
		if (isFinished)
			if (onLeave)
				onLeave(); // peut etre mettre ca dans un useEffect
	}, [isFinished])



	return (
		<React.Fragment>
			<p className="leave-text">Are you sure you wanna leave the channel <b>{channelName}</b> ?</p>
			<button type="button" onClick={click}
			className="continuebtn-channelMenu">Leave</button>
		</React.Fragment>
	)
}

export default LeaveChannelMenu