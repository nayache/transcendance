import Navbar from "./Navbar";
import '../styles/TwoFASettings.css'
import '../styles/Toggle.css'
import React, { useEffect, useRef, useState } from "react";
import { FiTriangle } from "react-icons/fi"
import Modal from "./Modal";
import EnableTwoFaSettings from "./EnableTwoFASettings";
import ClientApi from "./ClientApi.class";
import { API_TWOFA_ROUTE } from "../constants/RoutesApi";
import { useSocket } from "../hooks/useSocket";
import { usePseudo } from "../hooks/usePseudo";
import { useAvatar } from "../hooks/useAvatar";
import { useNotification } from "../hooks/useNotification";
import { useInviteNotification } from "../hooks/useInviteNotification";

let differenceHeight: number = 0;

const TwoFASettings = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const avatar = useAvatar()
	const notification = useNotification(socket, {pseudo, avatar})
	const inviteNotification = useInviteNotification(socket, pseudo)



	return (
		<div>
			<Navbar />
			{ notification }
			{ inviteNotification }			
			<EnableTwoFaSettings />
		</div>
	)
}

export default TwoFASettings