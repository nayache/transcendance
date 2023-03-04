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
import { IChannel } from "../interface/IChannelUser";
import {
	addChannel,
	removeChannel,
	setCurrentChannel,
	ChannelProps, resetAllChannels } from "../redux/channelsSlice";
import { useDispatch } from "react-redux";
import { delay } from "../functions/Debug_utils";


const ChatContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	margin: 0% 2% 0;
	height: 80%;
`


const ChatPage = () => {

	const [pseudo, setPseudo] = useState<string>();
	const dispatch = useDispatch();
	const [isOkay, setIsOkay] = useState<boolean>();
	const socket = useSocket()



	useEffect(() => {
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
	}, [])

	useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_PSEUDO_ROUTE)
				console.log("data.pseudo = ", data.pseudo)
				setPseudo(data.pseudo)
				console.log("pseudo = ", pseudo)
				if (pseudo)
					setIsOkay(true);
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setIsOkay(false)
				else if (_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND )
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudo])





	return (
		<React.Fragment>
			<Navbar />
			<ChatContainer>
				<ChannelPart socket={socket}
				pseudo={pseudo} />
				<Chat socket={socket}
				pseudo={pseudo} />
				<ChannelPlayers />
			</ChatContainer>
		</React.Fragment>
	)
}

export default ChatPage;