import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_LEAVE_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import { RootState } from "../redux/store"
import ClientApi from "./ClientApi.class"
import '../styles/KickChannelMenu.css'

interface Props {
	channelName: string
	target: IChannelUser,
	onKick?: () => void,
	onKickFail?: () => void,
}

export const KickChannelMenu = ({ channelName, target, onKick, onKickFail }: Props) => {



	const click = async () => {
		try {
			/* PATCH /chat/channel/kick {channel: string, target: string} */
			const { kicked: kickedPseudo } = await ClientApi.patch(API_CHAT_CHANNEL_KICK_ROUTE,
				JSON.stringify({
					channel: channelName,
					target: target.pseudo
				}),
			'application/json')
			if (onKick)
				onKick()
		} catch (err) {
			console.log("err = ", err)
			if (onKickFail)
				onKickFail()
		}
	}



	return (
		<React.Fragment>
			<p className="leave-text">Are you sure you wanna kick {target.pseudo} from the <b>{channelName} channel</b> ?</p>
			<button type="button" onClick={click}
			className="continuebtn-channelMenu">Yes</button>
		</React.Fragment>
	)
}

export default KickChannelMenu