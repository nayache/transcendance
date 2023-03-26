import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_LEAVE_ROUTE, API_CHAT_CHANNEL_SETADMIN_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import ClientApi from "./ClientApi.class"
import '../styles/SetAdminChannelMenu.css'

interface Props {
	channelName: string
	target: IChannelUser,
	onSetAdmin?: () => void,
	onSetAdminFail?: () => void,
}

export const SetAdminChannelMenu = ({ channelName, target, onSetAdmin, onSetAdminFail }: Props) => {



	const click = async () => {
		try {
			/* PATCH /chat/channel/kick {channel: string, target: string} */
			const { kicked: kickedPseudo } = await ClientApi.patch(API_CHAT_CHANNEL_SETADMIN_ROUTE,
				JSON.stringify({
					channel: channelName,
					target: target.pseudo
				}),
			'application/json')
			if (onSetAdmin)
				onSetAdmin()
		} catch (err) {
			// console.log("err = ", err)
			if (onSetAdminFail)
				onSetAdminFail()
		}
	}



	return (
		<React.Fragment>
			<p className="setAdmin-text">Are you sure you wanna promote {target.pseudo} to admin on the <b>{channelName}</b> channel ?</p>
			<button type="button" onClick={click}
			className="setAdmin-continuebtn-channelMenu">Yes</button>
		</React.Fragment>
	)
}

export default SetAdminChannelMenu
