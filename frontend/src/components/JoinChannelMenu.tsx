import React, { useCallback, useEffect, useRef, useState } from "react"
import { API_CHAT_ALL_CHANNELNAMES_ROUTE, API_CHAT_ALL_CHANNELPRVW_ROUTE, API_CHAT_ALL_CHANNELS_ROUTE, API_CHAT_CHANNEL_JOIN_ROUTE, API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelUser } from "../interface/IChannel";
import ClientApi from "./ClientApi.class";
import '../styles/JoinChannelMenu.css'
import { MAX_CARAC_CHANNEL_NAME } from "./ChannelPart";
import { BiArrowBack } from "react-icons/bi"
import { GiPadlock } from "react-icons/gi";
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { BtnStatus, printButton } from "./Button";


interface Props {
	chanUser: IChannelUser,
	channels: IChannel[],
	addChannel: (channel: IChannel) => void,
	setCurrentChannel: (channelName: string) => void,
	onJoin?: () => void,
	onJoinFail?: () => void
}

interface IChannelPreview {
	name: string,
	password: boolean,
	prv: boolean
}

export const JoinChannelMenu = ({ chanUser, channels, addChannel, setCurrentChannel, onJoin, onJoinFail }: Props) => {

	const channelWritten = useRef<string>('');
	const passwordWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [channelPrvws, setChannelPrvws] = useState<IChannelPreview[]>([]);
	const [visibleChannelPrvws, setVisibleChannelPrvws] = useState<IChannelPreview[]>([]);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [errorPassword, setErrorPassword] = useState<string>("")
	const [errorChannel, setErrorChannel] = useState<string>("")
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [btnStatus, setBtnStatus] = useState<BtnStatus>("idle")
	const [channelSelected, setChannelSelected] = useState<IChannelPreview | null>(null);


	


	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		passwordWritten.current = e.target.value;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		channelWritten.current = e.target.value;
		
		if (channelWritten.current.trim().length == 0) {
			setVisibleChannelPrvws(channelPrvws);
			return ;
		}
		const returnedItems: IChannelPreview[] = channelPrvws.filter(channelPrvw => (
			channelPrvw.name.toLocaleLowerCase().search(channelWritten.current.trim().toLowerCase()) !== -1
		))
		setVisibleChannelPrvws(returnedItems);
	}

	const handleValidate = () => {
		setErrorPassword("");
		setErrorChannel("");
		(async () => {
			try {
				// console.log("channelSelected?.name = ", channelSelected?.name, " passwordWritten.current = ", passwordWritten.current)
				const { channel } = await ClientApi.patch(API_CHAT_CHANNEL_JOIN_ROUTE, JSON.stringify({
					name: channelSelected?.name,
					password: passwordWritten.current
				}), 'application/json')
				passwordWritten.current = ""
				addChannel(channel)
				setCurrentChannel(channel.name)
				setBtnStatus("good")
				setTimeout(() => setBtnStatus("idle"), 2000)
				if (onJoin)
					onJoin()
			} catch (err) {
				const _error: IError = err as IError

				// console.log("err = ", err);
				setBtnStatus("fail")
				setTimeout(() => setBtnStatus("idle"), 2000)
				if (_error.about === AboutErr.PASSWORD && _error.type === TypeErr.INVALID) {
					setErrorPassword("The password is invalid")
				}
				if (_error.about === AboutErr.CHANNEL && _error.type === TypeErr.INVALID) {
					setErrorChannel("You can't enter this channel. Reason: You are already inside")
				}
				else if (_error.about === AboutErr.USER && _error.type === TypeErr.REJECTED) {
					setErrorChannel("You can't enter this channel. Reason: You are banned")
				}
			}
			channelWritten.current = ""
			passwordWritten.current = ""
		})()
	}

	const printAboutChannels = () => {
		if (!channelSelected)
			return (
				<div className="joinChannel-channels-container">
					<div className="joinChannel-channels-child">
						{ visibleChannelPrvws?.map((visibleChannelPrvw, i) => (
							<div key={i} className={(() => {
								if (visibleChannelPrvw.prv)
									return "joinChannel-channel-container joinChannel-channel-container-prv"
								return "joinChannel-channel-container"
							})()}>
								<button key={i} onClick={() => setChannelSelected(visibleChannelPrvw)}
								disabled={visibleChannelPrvw.prv} className={(() => {
									if (visibleChannelPrvw.prv)
										return "joinChannel-channel-btn joinChannel-channel-btn-prv button_without_style"
									return "joinChannel-channel-btn button_without_style"
								})()}>
									<p className="joinChannel-channel-text">
										{visibleChannelPrvw.name}
									</p>
									{ visibleChannelPrvw.password && <GiPadlock className="joinChannel-padlock" /> }
								</button>
							</div>
						)) }
					</div>
				</div>
			)
		else
			return (
				<div className="joinChannel-form-container">
					<div className="joinChannel-title-container">
						<h3 className="joinChannel-title">Join the <b>{channelSelected.name} channel</b></h3>
					</div>
					<form className="joinChannel-form">
						{
							channelSelected.password &&
							<div className="joinChannel-password-container">
								<label>Password {
									channelSelected.password && (
										showPassword &&
										<RiEyeFill className="eye-svg" onClick={() => setShowPassword(false)}/> ||
										
										!showPassword &&
										<RiEyeCloseFill className="eye-svg" onClick={() => setShowPassword(true)}/>
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
								})()} />
								{ errorPassword && <p className="error-text">{errorPassword}</p> }
							</div>
						}
						{ errorChannel && <p className="error-text">{errorChannel}</p> }
						{ printButton({
							status: btnStatus,
							content: "Enter",
							className: "form-joinChannel-button",
							onClick: () => {
								setBtnStatus("loading")
								handleValidate()
							}})
						}
					</form>
				</div>
			)
	}





	useEffect(() => {
		(async () => {
			try {
				const { channels: realChannelPrvws }: { channels: IChannelPreview[] } = await ClientApi
					.get(API_CHAT_ALL_CHANNELPRVW_ROUTE);
				const channelPrvws: IChannelPreview[] = realChannelPrvws
				.filter(realChannelPrvw =>
					channels.every(channel => channel.name !== realChannelPrvw.name)
				)
				// console.log("channelPrvws = ", channelPrvws)
				setChannelPrvws(channelPrvws);
				setVisibleChannelPrvws(channelPrvws);
			} catch (err) {
				// console.log("err = ", err);
			}
		})()
	}, [])

	useEffect(() => {
		if (!channelSelected?.password) {
			if (inputPwdRef.current)
				inputPwdRef.current.value = ""
		}
	}, [channelSelected?.password])

	useEffect(() => {
		if (!channelSelected) {
			if (inputRef.current)
				inputRef.current.value = channelWritten.current
			setErrorPassword("");
			setErrorChannel("");
		}
	}, [channelSelected])





	return (
		<React.Fragment>
			<div className="joinChannel-container-container">
				<div className="joinChannel-container">
					<div className="joinChannel-child">
						{ channelSelected && <BiArrowBack className="back-arrow-svg"
						onClick={() => {
							setChannelSelected(null)
						}} /> }
						{ !channelSelected && <input spellCheck={false} ref={inputRef} className='joinChannel-input'
						placeholder='Search a channel...'
						onChange={handleChange} /> }
						<div className="joinChannel-content-container">
							{ printAboutChannels() }
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default JoinChannelMenu
