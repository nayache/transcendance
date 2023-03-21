import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_BAN_ROUTE, API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_LEAVE_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import ClientApi from "./ClientApi.class"
import '../styles/BanChannelMenu.css'

interface Props {
	channelName: string
	target: IChannelUser,
	onBan?: () => void,
	onBanFail?: () => void,
}

export const BanChannelMenu = ({ channelName, target, onBan, onBanFail }: Props) => {



	const click = async () => {
		try {
			/* PATCH /chat/channel/ban {channel: string, target: string} */
			const { banned: bannedPseudo } = await ClientApi.patch(API_CHAT_CHANNEL_BAN_ROUTE,
				JSON.stringify({
					channel: channelName,
					target: target.pseudo
				}),
			'application/json')
			if (onBan)
				onBan()
		} catch (err) {
			// console.log("err = ", err)
			if (onBanFail)
				onBanFail()
		}
	}



	return (
		<React.Fragment>
			<p className="leave-text">Are you sure you wanna ban {target.pseudo} from the <b>{channelName}</b> channel ?</p>
			<p className="leave-text">{target.pseudo} won't be able to come in again</p>
			<button type="button" onClick={click}
			className="continuebtn-channelMenu">Yes</button>
		</React.Fragment>
	)
}

export default BanChannelMenu
