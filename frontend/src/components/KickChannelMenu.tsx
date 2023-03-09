import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_LEAVE_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import { RootState } from "../redux/store"
import ClientApi from "./ClientApi.class"
import '../styles/KickChannelMenu.css'

interface Props {
	channelName: string
	chanUser: IChannelUser,
	target: IChannelUser,
	channels: IChannel[],
	currentChannelId: number,
	setCurrentChannel: (channelName: string) => void,
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	updateChannel: (channel: IChannel) => void,
	onKick?: () => void,
	onKickFail?: () => void,
}

export const KickChannelMenu = ({ channelName, currentChannelId, onKick, chanUser, target,
setCurrentChannel, channels, removeChannel, updateChannel, onKickFail }: Props) => {






	const click = async () => {
		if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {
			const currentChannelName: string = channels[currentChannelId].name;

			/* PATCH /chat/channel/kick {channel: string, target: string} */
			ClientApi.patch(API_CHAT_CHANNEL_KICK_ROUTE,
				JSON.stringify({
					channel: channelName,
					target: target.pseudo
				}),
			'application/json')
				.then(({ kicked: pseudoKicked }: { kicked: string }) => {
					if (onKick)
						onKick()
				})
				.catch(err => {
					console.log("err = ", err);
					if (onKickFail)
						onKickFail()
				})
		}
	}




	
	// useEffect(() => {

	// 	console.log("chanToRedirectTo.current.name = ", chanToRedirectTo.current?.name)
	// 	if (chanToRedirectTo.current) {
	// 		if (channels.length < previousLength.current) {
	// 			setCurrentChannel(chanToRedirectTo.current.name)
	// 			chanToRedirectTo.current = null
	// 			previousLength.current = channels.length
	// 		}
	// 	}
	// }, [channels])

	// useEffect(() => {
	// 	console.log("(dans useEffect) previousChannelsLength.current = ", previousChannelsLength.current)
	// 	console.log("(dans useEffect) previousCurrentChannelName.current = ", previousCurrentChannelName.current)
	// 	console.log("(dans useEffect) previousCurrentChannelId.current = ", previousCurrentChannelId.current)
	// 	if (previousChannelsLength.current !== undefined
	// 	&& previousCurrentChannelName.current !== undefined) {
	// 		if (previousChannelsLength.current < channels.length) {
	// 			if (previousCurrentChannelName.current === channelName) {
	// 				if (previousCurrentChannelId.current !== currentChannelId) {
	// 					if (onKick)
	// 						onKick();
	// 				}
	// 				else {
	// 					if (onKick)
	// 						onKick();
	// 				}
	// 			}
	// 		}
	// 	}
	// }, [currentChannelId, channels, previousCurrentChannelId.current, previousChannelsLength.current, previousCurrentChannelName.current])



	return (
		<React.Fragment>
			<p className="leave-text">Are you sure you wanna kick {target.pseudo} from the channel <b>{channelName}</b> ?</p>
			<button type="button" onClick={click}
			className="continuebtn-channelMenu">Leave</button>
		</React.Fragment>
	)
}

export default KickChannelMenu