import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { API_CHAT_ALL_CHANNELNAMES_ROUTE, API_CHAT_ALL_CHANNELPRVW_ROUTE, API_CHAT_ALL_CHANNELS_ROUTE, API_CHAT_CHANNEL_JOIN_ROUTE, API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelUser } from "../interface/IChannelUser";
import { addChannel, setCurrentChannel } from "../redux/channelsSlice";
import ClientApi from "./ClientApi.class";
import '../styles/JoinChannelMenu.css'
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MAX_CARAC_NAME_CHANNEL } from "./ChannelPart";


interface Props {
	chanUser: IChannelUser,
	onJoin?: () => void,
	onJoinFail?: () => void
}

interface IChannelPreview {
	name: string,
	password: boolean,
	prv: boolean
}

export const JoinChannelMenu = ({ chanUser, onJoin, onJoinFail }: Props) => {

	const channelWritten = useRef<string>('');
	const passwordWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [visibleChannelPrvws, setVisibleChannelPrvws] = useState<IChannelPreview[]>([]);
	const { channels } = useSelector((state: RootState) => state.room)
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [channelSelected, setChannelSelected] = useState<IChannelPreview | null>(null);
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		channelWritten.current = e.target.value;
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
				if (onJoin)
					onJoin()
			} catch (err) {
				console.log("err = ", err);
			}
			channelWritten.current = ""
			passwordWritten.current = ""
		})()
	}

	const printAboutChannels = () => {
		if (!channelSelected)
			return (
				<div className="channels-child">
					{ visibleChannelPrvws?.map((visibleChannelPrvw, i) => (
						<div className="joinChannel-channel" key={i}>
							<button onClick={() => setChannelSelected(visibleChannelPrvw)} className="button_without_style">
								<p className="joinChannel-channel-text">{visibleChannelPrvw.name}</p>
							</button>
						</div>
					)) }
				</div>
			)
		else
			return (
				<div className="joinChannel-container">
					<div className="joinChannel-title-container">
						<p className="joinChannel-title">Join the channel {channelSelected.name}</p>
					</div>
					<form onSubmit={handleValidate} className="joinChannel-form">
						<div className="joinChannel-name">
							<label>Name</label>
							<input onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} onChange={handleNameChange} />
						</div>
						<div className="joinChannel-password">
							<label>Password</label>
							<input ref={inputPwdRef} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
							onChange={handlePasswordChange} disabled={!channelSelected.prv} />
						</div>
						<button className="form-joinChannel-button" type="submit">Validate</button>
					</form>
				</div>
			)
	}





	useEffect(() => {
		(async () => {
			try {
				const { channels: channelPrvws }: { channels: IChannelPreview[] } = await ClientApi
					.get(API_CHAT_ALL_CHANNELPRVW_ROUTE);
				const visibleChannelPrvws: IChannelPreview[] = channelPrvws.filter(channelPrvw =>
					channels.every(channel => channel.name !== channelPrvw.name)
				)
				console.log("visibleChannelPrvws = ", visibleChannelPrvws)
				setVisibleChannelPrvws(visibleChannelPrvws);
			} catch (err) {
				console.log("err = ", err);
			}
		})()
	}, [])

	useEffect(() => {
		if (inputPwdRef.current) {
			if (!channelSelected?.password)
				inputPwdRef.current.value = ""
		}
	}, [channelSelected?.password])




	return (
		<React.Fragment>
			<div className="joinChannel-container-container">
				<div className="joinChannel-container">
					<div className="joinChannel-child">
						<input ref={inputRef} className='joinChannel-input'
						placeholder='Type an existing channel name...'
						onChange={handleChange} />
						<div className="channels-container">
						{printAboutChannels()}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default JoinChannelMenu