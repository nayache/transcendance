import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannelUser } from "../interface/IChannelUser";
import { addChannel, setCurrentChannel } from "../redux/channelsSlice";
import { MAX_CARAC_NAME_CHANNEL } from "./ChannelPart";
import ClientApi from "./ClientApi.class";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi"
import "../styles/CreateChannelMenu.css"

interface Props {
	chanUser: IChannelUser,
	onCreate?: () => void,
}

const CreateChannelMenu = ({ onCreate, chanUser }: Props) => {


	const channelWritten = useRef<string>('');
	const passwordWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [isPrivate, setIsPrivate] = useState<boolean>(false);
	const dispatch = useDispatch()


	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		channelWritten.current = e.target.value;
		console.log("channelWritten.current = ", channelWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_NAME_CHANNEL)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		passwordWritten.current = e.target.value;
		console.log("passwordWritten.current = ", passwordWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_NAME_CHANNEL)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handleValidate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		(async () => {
			try {
				const { channel } = await ClientApi.post(API_CHAT_CHANNEL_ROUTE, JSON.stringify({
					name: channelWritten.current,
					password: passwordWritten.current
				}), 'application/json')
				dispatch(addChannel(channel))
				dispatch(setCurrentChannel(channel.name))
				if (onCreate)
					onCreate()
			} catch (err) {
				console.log("err = ", err);
			}
			channelWritten.current = ""
			passwordWritten.current = ""
		})()
	}




	useEffect(() => {
		if (inputPwdRef.current) {
			if (isPrivate)
				inputPwdRef.current.value = ""
		}
	}, [isPrivate])



	return (
		<React.Fragment>
			<div className="createChannel-container">
				<div className="createChannel-title-container">
					<p className="createChannel-title">Create a new channel</p>
					{
						isPrivate && <GiPadlock className="padlock-svg" onClick={() => setIsPrivate(false)} /> ||
						!isPrivate && <GiPadlockOpen className="padlock-svg" onClick={() => setIsPrivate(true)} />
					}
				</div>
				<form onSubmit={handleValidate} className="createChannel-form">
					<div className="createChannel-name">
						<label>Name</label>
						<input onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} onChange={handleNameChange} />
					</div>
					<div className={(() => {
						if (!isPrivate)
							return "createChannel-password disabled-div-form"
						return "createChannel-password"
					})()}>
						<label>Password</label>
						<input ref={inputPwdRef} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} onChange={handlePasswordChange} disabled={!isPrivate}
						/>
					</div>
					<button className="form-createChannel-button" type="submit">Validate</button>
				</form>
			</div>
		</React.Fragment>
	)
}

export default CreateChannelMenu