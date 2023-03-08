import React, { useCallback, useEffect, useRef, useState } from "react"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelUser } from "../interface/IChannelUser";
import { MAX_CARAC_CHANNEL_NAME, MAX_CARAC_CHANNEL_PWD, MIN_CARAC_CHANNEL_NAME, MIN_CARAC_CHANNEL_PWD } from "./ChannelPart";
import ClientApi from "./ClientApi.class";
import { GiPadlock, GiPadlockOpen, GiOpenGate, GiGate } from "react-icons/gi"
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri"
import "../styles/CreateChannelMenu.css"
import { AboutErr, IError, TypeErr } from "../constants/EError";

interface Props {
	chanUser: IChannelUser,
	addChannel: (channel: IChannel) => void,
	setCurrentChannel: (channelName: string) => void,
	onCreate?: () => void,
}

const CreateChannelMenu = ({ onCreate, addChannel, setCurrentChannel, chanUser }: Props) => {


	const channelWritten = useRef<string>('');
	const [errorChanName, setErrorChanName] = useState<string>("")
	const passwordWritten = useRef<string | undefined>(undefined);
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [errorPassword, setErrorPassword] = useState<string>("")
	const inputRef = useRef<HTMLInputElement>(null);
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [password, setPassword] = useState<boolean>(false);
	const [prv, setPrv] = useState<boolean>(false);


	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		channelWritten.current = e.target.value;
		console.log("channelWritten.current = ", channelWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_CHANNEL_NAME)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		passwordWritten.current = e.target.value;
		console.log("passwordWritten.current = ", passwordWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_CHANNEL_NAME)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handleValidate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorChanName("")
		setErrorPassword("");
		(async () => {
			try {
				const { channel } = await ClientApi.post(API_CHAT_CHANNEL_ROUTE, JSON.stringify({
					name: channelWritten.current,
					prv,
					password: passwordWritten.current
				}), 'application/json')
				addChannel(channel)
				setCurrentChannel(channel.name)
				if (onCreate)
					onCreate()
				channelWritten.current = ""
				passwordWritten.current = ""
			} catch (err) {
				const _error: IError = err as IError;

				if ((_error.about === AboutErr.REQUEST ||
					_error.about === AboutErr.CHANNEL) && _error.type === TypeErr.INVALID) {
					if (channelWritten.current.length < MIN_CARAC_CHANNEL_NAME)
						setErrorChanName("The channel name written is too little (" + MIN_CARAC_CHANNEL_NAME + " char min)")
					else if (channelWritten.current.length > MAX_CARAC_CHANNEL_NAME)
						setErrorChanName("The channel name written is too long (" + MAX_CARAC_CHANNEL_NAME + " char max)")
					else if (channelWritten.current.length >= MIN_CARAC_CHANNEL_NAME
					&& channelWritten.current.length <= MAX_CARAC_CHANNEL_NAME) {
						if (channelWritten.current.search(/\s/) !== -1)
							setErrorChanName("The channel can't have spaces")
					}
					if (password && passwordWritten.current !== undefined) {
						if (passwordWritten.current.length < MIN_CARAC_CHANNEL_PWD)
							setErrorPassword("Please set a password longer (" + MIN_CARAC_CHANNEL_PWD + " char min)")
						else if (passwordWritten.current.length > MAX_CARAC_CHANNEL_PWD)
							setErrorPassword("Please set a password more little (" + MAX_CARAC_CHANNEL_PWD + " char max)")
						else if (passwordWritten.current.length >= MIN_CARAC_CHANNEL_NAME
						&& passwordWritten.current.length <= MAX_CARAC_CHANNEL_NAME) {
							setErrorPassword("The password must have 6 letters minimum")
							if (passwordWritten.current.search(/\s/) !== -1)
								setErrorPassword("The password can't have whitespaces")
						}
					}
				}
			}
		})()
	}




	useEffect(() => {
		if (inputPwdRef.current) {
			if (!password) {
				inputPwdRef.current.value = ""
				setErrorPassword("")
				passwordWritten.current = undefined
				setPassword(false);
			}
			else {
				passwordWritten.current = ""
			}
		}
	}, [password])



	return (
		<React.Fragment>
			<div className="createChannel-container">
				<div className="createChannel-title-container">
					<h3 className="createChannel-title">Create a new channel</h3>
					{
						password && <GiPadlock className="padlock-svg" onClick={() => {setPassword(false)}} /> ||
						!password && <GiPadlockOpen className="padlock-svg" onClick={() => setPassword(true)} />
					}
				</div>
				<form onSubmit={handleValidate} className="createChannel-form">
					<div className="createChannel-prv">
						<label>Open to public 
						{
							prv && <GiGate className="gate-svg" onClick={() => {setPrv(false)}} /> ||
							!prv && <GiOpenGate className="gate-svg" onClick={() => {setPrv(true)}} />
						}</label>
						<label className="switch">
							<input type="checkbox" checked={!prv} onClick={() => setPrv(prv => !prv)} />
							<span className="slider round"></span>
						</label>
					</div>
					<div className="createChannel-name">
						<label>Name</label>
						<input onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
						className={(() => {
							if (errorChanName) 
								return "shaking-input"
							return undefined
						})()} onChange={handleNameChange} />
						{ errorChanName && <p className="error-text">{errorChanName}</p> }
					</div>
					<div className={(() => {
						if (!password)
							return "createChannel-password disabled-div-form"
						return "createChannel-password"
					})()}>
						<label>Password {
							password && (
								showPassword && <RiEyeFill className="eye-svg" onClick={() => setShowPassword(false)}/> ||
								!showPassword && <RiEyeCloseFill className="eye-svg" onClick={() => setShowPassword(true)}/>
							)
						}</label>
						<input ref={inputPwdRef} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
						className={(() => {
							if (errorPassword) 
								return "shaking-input"
							return undefined
						})()} onChange={handlePasswordChange}
						type={(() => {
							if (showPassword)
								return "text"
							else
								return "password"
						})()}
						disabled={!password} />
						{ password && errorPassword && <p className="error-text">{errorPassword}</p> }
					</div>
					<button className="form-createChannel-button" type="submit">Validate</button>
				</form>
			</div>
		</React.Fragment>
	)
}

export default CreateChannelMenu