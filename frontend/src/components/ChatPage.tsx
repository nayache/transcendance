import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Chat from "./Chat";
import Navbar from "./Navbar";
import styled from "styled-components";
import ChannelPart from "./ChannelPart";
import ClientApi from "./ClientApi.class";
import { API_CHAT_USER_CHANNELS_ROUTE, API_PSEUDO_ROUTE, API_SOCKET_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { io, Socket } from "socket.io-client";
import { useSocket } from "../hooks/useSocket";
import ChannelPlayers from "./ChannelPlayers";
import { IChannel, IChannelUser } from "../interface/IChannelUser";
import {
	addChannel,
	removeChannel,
	setCurrentChannel,
	ChannelProps, resetAllChannels } from "../redux/channelsSlice";
import { useDispatch } from "react-redux";
import { delay } from "../functions/Debug_utils";
import { usePseudo } from "../hooks/usePseudo";
import ServerDownPage from "./ServerDownPage";
import { useChanUser } from "../hooks/useChanUser";


const ChatContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: flex-basis;
	margin: 0% 2% 0;
	height: 80%;
`


const ChatPage = () => {

	const pseudo = usePseudo();
	const chanUser = useChanUser(pseudo)
	const dispatch = useDispatch();
	const [isOkay, setIsOkay] = useState<boolean>();
	const socket = useSocket()



	useEffect(() => {
		if (pseudo) {
			(async () => {
				try {
					const data: { channels: IChannel[] } = await ClientApi.get(API_CHAT_USER_CHANNELS_ROUTE)
					console.log("data.channels = ", data.channels);
					dispatch(resetAllChannels(data.channels))
					dispatch(setCurrentChannel('General'))
				} catch (err) {
					console.log("err = ", err);
				}
			})()
		}
	}, [pseudo])




	const getPage = () => {
		return (
			<React.Fragment>
				<Navbar />
				<ChatContainer>
					<ChannelPart socket={socket}
					chanUser={chanUser} />
					<Chat socket={socket}
					pseudo={pseudo} />
					{/* // chanUser={chanUser} /> */}
					<ChannelPlayers socket={socket}
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