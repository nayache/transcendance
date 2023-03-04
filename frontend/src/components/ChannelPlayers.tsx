import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IChannelUser } from "../interface/IChannelUser";
import { RootState } from "../redux/store";
import '../styles/ChannelPlayers.css'
import ChannelPlayer from "./ChannelPlayer";


const ChannelPlayers = () => {
	
	const { channels, currentChannelId } = useSelector((state: RootState) => state.room)
	const users: IChannelUser[] | null = currentChannelId !== -1 ? channels[currentChannelId].users : null
	const [ visiblePlayers, setVisiblePlayers ] = useState<IChannelUser[] | undefined>(
		currentChannelId !== -1 ? channels[currentChannelId].users: undefined
	)
	const [ doDisplayPreviews, setDoDisplayPreviews ] = useState<boolean[]>(
		currentChannelId !== -1 ? channels[currentChannelId].users.map(user => false): []
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
		if (currentChannelId !== -1) {
			setVisiblePlayers(
				channels[currentChannelId].users
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
							playerName={player.pseudo} status={player.status}/>
						))
					}
				</div>
			</div>
		</div>
	)
}

export default ChannelPlayers;