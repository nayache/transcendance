import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_LEAVE_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannelUser"
import { RootState } from "../redux/store"
import ClientApi from "./ClientApi.class"
import '../styles/LeaveChannelMenu.css'

interface Props {
	channelName: string
	chanUser: IChannelUser,
	channels: IChannel[],
	currentChannelId: number,
	setCurrentChannel: (channelName: string) => void,
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	updateChannel: (channel: IChannel) => void,
	onLeave?: () => void,
	onLeaveFail?: () => void,
}

export const LeaveChannelMenu = ({ channelName, currentChannelId, onLeave,
setCurrentChannel, channels, removeChannel, updateChannel, onLeaveFail }: Props) => {


	const previousLength = useRef<number>(0);
	const chanToRedirectTo = useRef<IChannel | null>(null);




	const click = async () => {
		if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {
			const currentChannelName: string = channels[currentChannelId].name;
			
			ClientApi.patch(API_CHAT_CHANNEL_LEAVE_ROUTE, JSON.stringify({
				name: channelName
			}), 'application/json')
				.then (({ channel }: { channel: IChannel }) => {
					removeChannel(channelName, currentChannelName === channelName ? channel : null)
					if (onLeave)
						onLeave();
				})
				.catch(err => {
					console.log("err = ", err);
					if (onLeaveFail)
						onLeaveFail()
				})
		}
	}




	
	useEffect(() => {

		console.log("chanToRedirectTo.current.name = ", chanToRedirectTo.current?.name)
		if (chanToRedirectTo.current) {
			if (channels.length < previousLength.current) {
				setCurrentChannel(chanToRedirectTo.current.name)
				chanToRedirectTo.current = null
				previousLength.current = channels.length
			}
		}
	}, [channels])

	// useEffect(() => {
	// 	console.log("(dans useEffect) previousChannelsLength.current = ", previousChannelsLength.current)
	// 	console.log("(dans useEffect) previousCurrentChannelName.current = ", previousCurrentChannelName.current)
	// 	console.log("(dans useEffect) previousCurrentChannelId.current = ", previousCurrentChannelId.current)
	// 	if (previousChannelsLength.current !== undefined
	// 	&& previousCurrentChannelName.current !== undefined) {
	// 		if (previousChannelsLength.current < channels.length) {
	// 			if (previousCurrentChannelName.current === channelName) {
	// 				if (previousCurrentChannelId.current !== currentChannelId) {
	// 					if (onLeave)
	// 						onLeave();
	// 				}
	// 				else {
	// 					if (onLeave)
	// 						onLeave();
	// 				}
	// 			}
	// 		}
	// 	}
	// }, [currentChannelId, channels, previousCurrentChannelId.current, previousChannelsLength.current, previousCurrentChannelName.current])



	return (
		<React.Fragment>
			<p className="leave-text">Are you sure you wanna leave the channel <b>{channelName}</b> ?</p>
			<button type="button" onClick={click}
			className="continuebtn-channelMenu">Leave</button>
		</React.Fragment>
	)
}

export default LeaveChannelMenu