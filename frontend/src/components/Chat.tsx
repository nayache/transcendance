import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import '../styles/Chat.css'
import { useSocket } from "../hooks/useSocket";
import ClientApi from "./ClientApi.class";
import { API_CHAT_MESSAGES_ROUTE } from "../constants/RoutesApi";

const Chat = () => {

	const socket = useSocket('ws://localhost:3042', { auth: {token: `Bearer ${ClientApi.token}`}})
	const [messages, setMessages] = useState<JSX.Element[]>([]);
	const msg = useRef<string>('');

	
	//creer des hook pour les socket.on (je crois)
	socket.on("message", (pseudoSender, message) => {
		setMessages(oldmessages => [...oldmessages,
			<p><b className="other_pseudo">{pseudoSender}</b>: {message}</p>
		])
	})


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		msg.current = e.target.value;
	}

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		let receiver: string;
		let msgData: string;

		[receiver, msgData] = msg.current.split('/');
		console.log("receiver = ", receiver)
		console.log("msgData = ", msgData)
		// stocker pseudo dans redux
		setMessages(oldmessages => [...oldmessages,
			<p>Me: {msgData}    <i>/silent to {receiver}</i></p>
		])
		try {
			ClientApi.post(API_CHAT_MESSAGES_ROUTE, JSON.stringify({
				target: receiver,
				msg: msgData
			}), 'application/json')
		} catch (err) {
			console.log("err = ", err);
		}
	}


	return (
		<div>
			<Navbar />
			<div className="messages-container">
				{ messages }
			</div>
			<div className="buttons-container">
				<div>
					<input type={"text"} onChange={handleChange} />
					<button onClick={handleClick}>Send</button>
				</div>
				<div>
					<button>General</button>
					<button>Humour</button>
					<button>Ranked</button>
					<button>Searching team</button>
					<button>Quick game</button>
				</div>
			</div>
		</div>
	);
}

export default Chat;