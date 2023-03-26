import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_LEAVE_ROUTE, API_CHAT_CHANNEL_MUTE_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import ClientApi from "./ClientApi.class"
import '../styles/MuteChannelMenu.css'

interface Props {
	channelName: string
	target: IChannelUser,
	onMute?: () => void,
	onMuteFail?: () => void,
}

export const MuteChannelMenu = ({ channelName, target, onMute, onMuteFail }: Props) => {

	const timeWritten = useRef<string | null>(null)
	const spanInuptRef = useRef<HTMLSpanElement>(null);

	
	
	// const handleOnKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
	// 	if (!(event.key >= '0' && event.key <= '9'
	// 	|| event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
	// 	|| event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Control'))
	// 		event.preventDefault();
	// 	timeWritten.current = event.currentTarget.textContent
	// 	// console.log("event.currentTarget.textContent (dans onKeyDown) = ", event.currentTarget.textContent)
	// }

	// const handleChangeTime = (e: React.ChangeEvent<HTMLSpanElement>) => {
	// 	timeWritten.current = e.currentTarget.textContent
	// 	// console.log("e.target.textContent (dans onChange) = ", e.target.textContent)
	// }

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {

			// let formData = new FormData(e.currentTarget);

			// // iterate through entries...
			// Array.from(formData.entries()).forEach(pair => {
			// 	// console.log(pair[0] + ": " + pair[1]);
				
			// });

			if (spanInuptRef.current)
				timeWritten.current = spanInuptRef.current.textContent
			// console.log("timeWritten.current = ", timeWritten.current)
			if (timeWritten.current) {
				/* PATCH /chat/channel/kick {channel: string, target: string} */
				const { muted: mutedPseudo } = await ClientApi.patch(API_CHAT_CHANNEL_MUTE_ROUTE,
					JSON.stringify({
						channel: channelName,
						target: target.pseudo,
						duration: +timeWritten.current,
					}),
				'application/json')
				if (onMute)
					onMute()
			}
		} catch (err) {
			// console.log("err = ", err)
			if (onMuteFail)
				onMuteFail()
		}
	}





	return (
		<React.Fragment>
			<form onSubmit={handleSubmit}>
				<p className="leave-text">Are you sure you wanna mute {target.pseudo} in the <b>{channelName}</b> channel ?</p>
				<div className="muteChannel-input-container">
					<p className="">Yes, I wanna mute {target.pseudo} for <span contentEditable={true} onKeyDown={(e) => {
						if (!(e.key >= '0' && e.key <= '9'
						|| e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'
						|| e.key === 'ArrowUp' || e.key === 'ArrowDown'))
							e.preventDefault()
					}} role="textbox" ref={spanInuptRef}
					/> sec</p>
				</div>
				<button type="submit"
				className="mutebtn-channelMenu">Confirm</button>
			</form>
		</React.Fragment>
	)
}

export default MuteChannelMenu
