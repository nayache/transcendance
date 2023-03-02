import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { IChannelUser } from "../interface/IChannelUser";
import { RootState } from "../redux/store";
import '../styles/ChannelPlayers.css'
import ChannelPlayer from "./ChannelPlayer";

interface Props {
	users: IChannelUser[]
}

const ChannelPlayers = () => {
	
	const { channels, currentChannelId } = useSelector((state: RootState) => state.room)
	const users: IChannelUser[] | null = currentChannelId !== -1 ? channels[currentChannelId].users : null
	const [visiblePlayers, setVisiblePlayers] = useState<IChannelUser[] | undefined>(
		currentChannelId !== -1 ? channels[currentChannelId].users: undefined
	)
	const dispatch = useDispatch();



	useEffect(() => {
		if (currentChannelId !== -1) {
			setVisiblePlayers(
				channels[currentChannelId].users
			)
		}
	}, [currentChannelId, users])



	return (
		<div className="channelPlayers-container">
			{
				visiblePlayers && visiblePlayers.map((player) => (
					<ChannelPlayer playerName={player.pseudo}/>
				))
			}
		</div>
	)
}

export default ChannelPlayers;