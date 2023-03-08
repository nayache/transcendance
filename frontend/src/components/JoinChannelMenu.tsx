import React, { useCallback, useEffect, useRef, useState } from "react"
import { API_CHAT_ALL_CHANNELNAMES_ROUTE, API_CHAT_ALL_CHANNELPRVW_ROUTE, API_CHAT_ALL_CHANNELS_ROUTE, API_CHAT_CHANNEL_JOIN_ROUTE, API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelUser } from "../interface/IChannelUser";
import ClientApi from "./ClientApi.class";
import '../styles/JoinChannelMenu.css'
import { MAX_CARAC_CHANNEL_NAME } from "./ChannelPart";
import { BiArrowBack } from "react-icons/bi"


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
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [channelSelected, setChannelSelected] = useState<IChannelPreview | null>(null);


	


	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		passwordWritten.current = e.target.value;
		console.log("passwordWritten.current = ", passwordWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_CHANNEL_NAME)
			console.log("max length reached")
		else
			console.log("okay good")
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

	const handleValidate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		(async () => {
			try {
				console.log("channelSelected?.name = ", channelSelected?.name, " passwordWritten.current = ", passwordWritten.current)
				const { channel } = await ClientApi.patch(API_CHAT_CHANNEL_JOIN_ROUTE, JSON.stringify({
					name: channelSelected?.name,
					password: passwordWritten.current
				}), 'application/json')
				addChannel(channel)
				setCurrentChannel(channel.name)
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
					{
						channelSelected.password &&
						<div className="joinChannel-password">
							<label>Password</label>
							<input ref={inputPwdRef} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
							onChange={handlePasswordChange} />
						</div>
					}
						<button className="form-joinChannel-button" type="submit">Validate</button>
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
				console.log("channelPrvws = ", channelPrvws)
				setChannelPrvws(channelPrvws);
				setVisibleChannelPrvws(channelPrvws);
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

	useEffect(() => {
		if (!channelSelected) {
			if (inputRef.current)
				inputRef.current.value = channelWritten.current
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
						{ !channelSelected && <input ref={inputRef} className='joinChannel-input'
						placeholder='Type an existing channel name...'
						onChange={handleChange} /> }
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