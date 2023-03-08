import '../styles/ChannelPart.css'
import React, { useEffect, useReducer, useState } from "react"
import Channel from "./Channel"
import { Socket } from "socket.io-client"
import { IChannel, IChannelUser } from "../interface/IChannelUser"
import { AiOutlinePlus } from "react-icons/ai"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"


export const MIN_CARAC_CHANNEL_NAME: number = 3;
export const MAX_CARAC_CHANNEL_NAME: number = 20;
export const MIN_CARAC_CHANNEL_PWD: number = 5;
export const MAX_CARAC_CHANNEL_PWD: number = 15;

interface Props {
	socket?: Socket,
	chanUser: IChannelUser | undefined,
	currentChannelId: number,
	channels: IChannel[],
	addChannel: (channel: IChannel) => void,
	updateChannel: (channel: IChannel) => void,	
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	setCurrentChannel: (channelName: string) => void,
}

const ChannelPart = ({ socket, updateChannel, setCurrentChannel, removeChannel,
	addChannel, chanUser, channels, currentChannelId  }: Props) => {

	console.log("channels (channelPart) = ", channels)
	const [visibleChannels, setVisibleChannels] = useState<string[] | undefined>(
		channels.map(channel => channel.name)
	)
	const [doPrintChannelMenu, setDoPrintChannelMenu] = useState<boolean>(false);



	useEffect(() => {
		if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {
			console.log("visibleChannels = ", visibleChannels)
			setVisibleChannels(channels.map(channel => channel.name))
		}
	}, [channels])



	return (
		<div className="channelPart-container-container">
			<h3 className="chat-title">Channels</h3>
			<div className="channelPart-container">
				<div className="channelPart-child">
					<AiOutlinePlus className="plus-svg"
					onClick={() => setDoPrintChannelMenu(true)} />
					<div className="channels-container">
						<div className="channels-child">
							{ chanUser && visibleChannels?.map((visibleChannel, i) => (
								<React.Fragment key={i}>
									<Channel channels={channels}
									addChannel={addChannel}
									removeChannel={removeChannel}
									updateChannel={updateChannel}
									setCurrentChannel={setCurrentChannel}
									currentChannelId={currentChannelId}
									chanUser={chanUser} channelName={visibleChannel}/>
								</React.Fragment>
							)) }
						</div>
					</div>
					{ chanUser && <ModalChannelMenu active={doPrintChannelMenu} type={ModalChannelType.JOINORCREATECHANNEL}
					channels={channels} currentChannelId={currentChannelId} addChannel={addChannel}
					removeChannel={removeChannel} setCurrentChannel={setCurrentChannel}
					updateChannel={updateChannel}
					chanUser={chanUser} callback={() => setDoPrintChannelMenu(false)}
					callbackFail={() => setDoPrintChannelMenu(false)} /> }
				</div>
			</div>
		</div>
	)
}

export default ChannelPart