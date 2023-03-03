import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux";
import { API_CHAT_CHANNEL_JOIN_ROUTE } from "../constants/RoutesApi";
import { IChannel } from "../interface/IChannelUser";
import { addChannel, setCurrentChannel, updateChannel } from "../redux/channelsSlice";
import { MAX_CARAC_NAME_CHANNEL } from "./ChannelPart";
import ClientApi from "./ClientApi.class";

const JoinChannel = () => {
	const channelWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch()



	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		channelWritten.current = e.target.value;
		console.log("channelWritten.current = ", channelWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_NAME_CHANNEL)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey)
		{
			e.preventDefault()
			try {
				await click();
				channelWritten.current = '';
			} catch (err) {
				console.log("err = ", err);
			}
		}
	}

	const click = useCallback(async () => {
		try {
			const [name, password] = channelWritten.current.split('/');
			const { channel }: { channel: IChannel } = await ClientApi.patch(API_CHAT_CHANNEL_JOIN_ROUTE, JSON.stringify({
				name,
				password
			}), 'application/json')
			//voir si je verifie
			dispatch(addChannel(channel))
			dispatch(setCurrentChannel(channel.name))
		} catch (err) {
			console.log("err = ", err);
		}
	}, [dispatch])




	return (
		<React.Fragment>
			<div className="addChannel-container">
				<input ref={inputRef} className='addChannel-input'
				placeholder='join room'
				onKeyDown={handleKeyDown} onChange={handleChange} />
			</div>
		</React.Fragment>
	)
}

export default JoinChannel