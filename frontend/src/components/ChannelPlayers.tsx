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
	
	const { currentChannel } = useSelector((state: RootState) => state.room)
	const [visiblePlayers, setVisiblePlayers] = useState<IChannelUser[] | undefined>(
		currentChannel?.users
	)
	const dispatch = useDispatch();



	useEffect(() => {
		setVisiblePlayers(
			currentChannel?.users
		)
	}, [currentChannel])



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