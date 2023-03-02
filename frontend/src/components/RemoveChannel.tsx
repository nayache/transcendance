import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux";
import { API_CHAT_CHANNEL_LEAVE_ROUTE } from "../constants/RoutesApi";
import { IChannel } from "../interface/IChannelUser";
import { removeChannel, setCurrentChannel, updateChannel } from "../redux/channelsSlice";
import '../styles/RemoveChannel.css'
import { MAX_CARAC_NAME_CHANNEL } from "./ChannelPart";
import ClientApi from "./ClientApi.class";

const RemoveChannel = () => {

	const channelWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();



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
			// return the General channel
			const { channel }: { channel: IChannel } = await ClientApi.patch(API_CHAT_CHANNEL_LEAVE_ROUTE, JSON.stringify({
				name: channelWritten.current
			}), 'application/json')
			dispatch(removeChannel(channelWritten.current))
			dispatch(updateChannel(channel))
			dispatch(setCurrentChannel('General'))
		} catch (err) {
			console.log("err = ", err);
		}
	}, [])




	return (
		<React.Fragment>
			<div className="addChannel-container">
				<input ref={inputRef} className='addChannel-input'
				placeholder='leave room'
				onKeyDown={handleKeyDown} onChange={handleChange} />
			</div>
		</React.Fragment>
	)
}

export default RemoveChannel