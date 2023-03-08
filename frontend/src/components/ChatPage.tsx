import React, { useCallback, useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import Navbar from "./Navbar";
import styled from "styled-components";
import ChannelPart from "./ChannelPart";
import ClientApi from "./ClientApi.class";
import { API_CHAT_USER_CHANNELS_ROUTE } from "../constants/RoutesApi";
import { useSocket } from "../hooks/useSocket";
import ChannelPlayers from "./ChannelPlayers";
import { IChannel, IChannelUser } from "../interface/IChannelUser";
import { delay } from "../functions/Debug_utils";
import { usePseudo } from "../hooks/usePseudo";
import ServerDownPage from "./ServerDownPage";
import { useChanUser } from "../hooks/useChanUser";


const ChatContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: flex-basis;
	flex-wrap: wrap;
	margin: 0% 2% 0;
	height: 80%;
`


const ChatPage = () => {

	const pseudo = usePseudo();
	const [channels, setChannels] = useState<IChannel[]>([]);
	const [currentChannelId, setCurrentChannelId] = useState<number>(0);
	const chanUser = useChanUser(pseudo, channels, currentChannelId)
	const [isOkay, setIsOkay] = useState<boolean>();
	const socket = useSocket()




	const setCurrentChannel = (channelName: string) => {
		const newIndex: number = channels
			.findIndex(channel => channel.name === channelName)
		
		if (!(newIndex <= -1 || newIndex >= channels.length)) {
			setCurrentChannelId(newIndex)
		}
		else if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {}
		else {
			const newIndex: number = channels
				.findIndex(channel => channel.name === "General")
			setCurrentChannelId(newIndex)
		}
	}

	const addChannel = (channel: IChannel) => {
		const index: number = channels.findIndex(realchannel =>
			realchannel.name === channel.name)
		
		// if (index !== -1) {	
		// 	const newchannels: IChannel[] = [...channels]
		// 	newchannels[index] = channel
		// 	setChannels(newchannels)
		// }
		// else {
			setChannels(channels => {
				const newchannels = [...channels,
					channel
				]
				const sortedChannels = newchannels
				
				return sortedChannels.sort((x, y) => {
					if (x.name == 'General')
						return -1
					else {
						if (y.name == 'General')
							return 1
						else
							return 0
					}
				})
			})
		// }
	}

	const updateChannel = (channel: IChannel) => {
		const index: number = channels.findIndex(realchannel =>
			realchannel.name === channel.name)
			
		if (index !== -1) {	
			const newchannels: IChannel[] = [...channels]
			newchannels[index] = channel
			setChannels(channels => {
				const sortedChannels = [...newchannels]
				
				return sortedChannels.sort((x, y) => {
					if (x.name == 'General')
						return -1
					else {
						if (y.name == 'General')
							return 1
						else
							return 0
					}
				})
			})
		}
		// else {
		// 	setChannels(channels => [...channels,
		// 		channel
		// 	])
		// }
	}

	const resetAllChannels = (channels: IChannel[]) => {
		setChannels(oldchannels => {
			const sortedChannels = [...channels]
			
			return sortedChannels.sort((x, y) => {
				if (x.name == 'General')
					return -1
				else {
					if (y.name == 'General')
						return 1
					else
						return 0
				}
			})
		})
	}

	const removeChannel = (channelName: string, genUpdated: IChannel | null) => {
		if (genUpdated) {
			setChannels(channels => {
				const newchannels = channels.filter(channel => channel.name !== channelName)
				const index: number = newchannels.findIndex(realchannel =>
					realchannel.name === genUpdated.name);

				const sortedChannels = newchannels.map((channel, i) => {
					if (index === i)
						return genUpdated
					return channel
				})
				sortedChannels.sort((x, y) => {
					if (x.name == 'General')
						return -1
					else {
						if (y.name == 'General')
							return 1
						else
							return 0
					}
				})
				return sortedChannels
			})
		}
		else {
			setChannels(channels => {
				const sortedChannels = channels.filter(channel => channel.name !== channelName)
				
				sortedChannels.sort((x, y) => {
					if (x.name == 'General')
						return -1
					else {
						if (y.name == 'General')
							return 1
						else
							return 0
					}
				})
				return sortedChannels
			})
		}
	}
	






	useEffect(() => {
		console.log("currentChannelId = ", currentChannelId)
		if (pseudo && (currentChannelId <= -1 || currentChannelId >= channels.length)) {
			(async () => {
				try {
					const data: { channels: IChannel[] } = await ClientApi.get(API_CHAT_USER_CHANNELS_ROUTE)
					console.log("data.channels = ", data.channels)
					data.channels.sort((x, y) => {
						if (x.name == 'General')
							return -1
						else {
							if (y.name == 'General')
								return 1
							else
								return 0
						}
					})
					resetAllChannels(data.channels)
					setCurrentChannel("General")
				} catch (err) {
					console.log("err = ", err);
				}
			})()
		}
	}, [pseudo, currentChannelId])




	const getPage = () => {

		console.log("channels (dans return chatPage) = ", channels)
		return (
			<React.Fragment>
				<Navbar />
				<ChatContainer>
					<ChannelPart socket={socket}
					updateChannel={updateChannel}
					setCurrentChannel={setCurrentChannel}
					removeChannel={removeChannel}
					addChannel={addChannel}
					currentChannelId={currentChannelId}
					channels={channels}
					chanUser={chanUser} />
					<Chat socket={socket}
					updateChannel={updateChannel}
					currentChannelId={currentChannelId}
					channels={channels}
					chanUser={chanUser} />
					<ChannelPlayers socket={socket}
					currentChannelId={currentChannelId}
					channels={channels}
					chanUser={chanUser} />
				</ChatContainer>
			</React.Fragment>
		)
	}



	return (
		<React.Fragment>
			{pseudo && getPage()}
			{pseudo === undefined && <ServerDownPage />}
		</React.Fragment>
	)
}

export default ChatPage;