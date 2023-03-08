import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { IChannel, IChannelUser } from "../interface/IChannelUser";
import { RootState } from "../redux/store";
import '../styles/ChannelPlayers.css'
import ChannelPlayer from "./ChannelPlayer";


interface Props {
	chanUser: IChannelUser | undefined,
	currentChannelId: number,
	channels: IChannel[],
	socket: Socket
}

const ChannelPlayers = ({ chanUser, currentChannelId, channels, socket }: Props) => {
	
	const users: IChannelUser[] | null = !(currentChannelId <= -1 || currentChannelId >= channels.length) ? channels[currentChannelId].users : null
	const [ visiblePlayers, setVisiblePlayers ] = useState<IChannelUser[] | undefined>(
		undefined
	)
	const [ doDisplayPreviews, setDoDisplayPreviews ] = useState<boolean[]>(
		[]
	)





	const onClick = (index: number, e?: React.MouseEvent<HTMLButtonElement>) => {
		const oldData: boolean[] = doDisplayPreviews.map(doDisplay => false)
		oldData[index] = true;
		setDoDisplayPreviews(oldData)
	}

	const onClosePreview = (index: number) => {
		const oldData: boolean[] = [...doDisplayPreviews]
		oldData[index] = false;
		setDoDisplayPreviews(oldData)
	}





	useEffect(() => {
		if (!(currentChannelId <= -1 || currentChannelId >= channels.length)) {
			setVisiblePlayers(
				channels[currentChannelId].users
			)
			setDoDisplayPreviews(
				channels[currentChannelId].users.map(user => false)
			)
		}
	}, [currentChannelId, users])





	return (
		<div className="channelPlayers-container-container">
			<h3 className="chat-title">Players</h3>
			<div className="channelPlayers-container">
				<div className="channelPlayers-child">
					{
						visiblePlayers && visiblePlayers.map((player, index) => (
							<ChannelPlayer key={index} doDisplayPreview={doDisplayPreviews[index]}
							onClick={(e) => onClick(index, e)} onClosePreview={() => onClosePreview(index)}
							chanUser={chanUser} player={player}/>
						))
					}
				</div>
			</div>
		</div>
	)
}

export default ChannelPlayers;