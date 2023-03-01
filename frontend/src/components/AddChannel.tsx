import React, { useCallback, useEffect, useRef } from 'react';
import { API_CHAT_CHANNEL_ROUTE } from '../constants/RoutesApi';
import '../styles/AddChannel.css'
import { MAX_CARAC_NAME_CHANNEL } from './ChannelPart';
import ClientApi from './ClientApi.class';


interface Props {
	pseudo: string | undefined,
}

const AddChannel = ({pseudo}: Props) => {

	const channelWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);



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
			await ClientApi.post(API_CHAT_CHANNEL_ROUTE, JSON.stringify({
				name,
				password
			}), 'application/json')
		} catch (err) {
			console.log("err = ", err);
		}
	}, [pseudo])




	return (
		<React.Fragment>
			<div className="addChannel-container">
				<input ref={inputRef} className='addChannel-input'
				placeholder='create room'
				onKeyDown={handleKeyDown} onChange={handleChange} />
			</div>
		</React.Fragment>
	)
}

export default AddChannel