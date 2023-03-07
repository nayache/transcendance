import '../styles/ChannelPart.css'
import React, { useEffect, useReducer, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import Channel from "./Channel"
import { Socket } from "socket.io-client"
import { useDispatch } from "react-redux"
import { IChannelUser } from "../interface/IChannelUser"
import { AiOutlinePlus } from "react-icons/ai"
import Modal from "./Modal"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"


export const MAX_CARAC_NAME_CHANNEL: number = 20;
export const MIN_CARAC_NAME_CHANNEL: number = 3;

interface Props {
	socket?: Socket,
	channelNames?: string[],
	chanUser: IChannelUser | undefined,
}

const ChannelPart = ({ socket, chanUser }: Props) => {

	const { channels } = useSelector((state: RootState) => state.room)
	const [visibleChannels, setVisibleChannels] = useState<string[] | undefined>(
		channels.map(channel => channel.name)
	)
	const [doPrintChannelMenu, setDoPrintChannelMenu] = useState<boolean>(false);
	const dispatch = useDispatch();



	useEffect(() => {
		console.log("visibleChannels = ", visibleChannels)
		setVisibleChannels(channels.map(channel => channel.name))
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
									<Channel chanUser={chanUser} channelName={visibleChannel}/>
								</React.Fragment>
							)) }
						</div>
					</div>
					{ chanUser && <ModalChannelMenu active={doPrintChannelMenu} type={ModalChannelType.JOINORCREATECHANNEL}
					chanUser={chanUser} callback={() => setDoPrintChannelMenu(false)}
					callbackFail={() => setDoPrintChannelMenu(false)} /> }
				</div>
			</div>
		</div>
	)
}

export default ChannelPart