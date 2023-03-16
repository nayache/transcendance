import React, { useEffect, useRef, useState } from "react"
import { API_PSEUDO_ROUTE, GOPLAY_EP, MESSAGES_ROUTE, MYFRIENDS_EP, REGISTER_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import ClientApi from "./ClientApi.class";
import '../styles/Home.css'
import Navbar from "./Navbar";
import ServerDownPage from "./ServerDownPage";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { Socket } from "socket.io-client";
import { usePseudo } from "../hooks/usePseudo";
import GoPlay from "./GoPlay";
import Notification, { NotificationType } from "./Notification";
import { useDMListener } from "../hooks/useDMListener";
import { useSocket } from "../hooks/useSocket";
import { useAvatar } from "../hooks/useAvatar";
import { IMessageEvRecv } from "../interface/IMessage";
import { IFriendEv } from "../interface/IFriend";
import { useNewFriendReqListener } from "../hooks/useNewFriendReqListener";
import { useNewFriendAccListener } from "../hooks/useFriendAccUpdater";

export type GameMode = "classic" | "medium" | "hard"

const Home = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const socket = useSocket();
	const [isOkay, setIsOkay] = useState<boolean | undefined>();
	const infos = useRef<IMessageEvRecv | IFriendEv | undefined>(undefined);
	const [notificationType, setNotificationType] = useState<NotificationType | null>(null)
	useDMListener(socket, {pseudo, avatar}, undefined, undefined, undefined, (payload) => {
		infos.current = payload
		console.log("infos.current = ", infos.current)
		setNotificationType(NotificationType.DM)
	})
	useNewFriendReqListener(socket, pseudo, undefined, (payload) => {
		infos.current = payload
		console.log("infos.current = ", infos.current)
		setNotificationType(NotificationType.NEWFRIEND)
	})
	useNewFriendAccListener(socket, pseudo, undefined, (payload) => {
		infos.current = payload
		console.log("infos.current = ", infos.current)
		setNotificationType(NotificationType.ACCEPTEDFRIEND)
	})




	const getPage = () => {
		
	//ajout de classements
	//historique des dernieres parties
	//(et si c pas trop chaud, chat general)

		return (
			<div>
				<Navbar/>
				{ (() => { console.log("(getPage) infos.current = ", infos.current, "  et  notificationType = ", notificationType); return true })() && notificationType !== null && infos.current !== undefined &&
					<Notification active={notificationType !== null ? true : false} type={notificationType}
					infos={infos.current}
					callback={({type, infos}) => {
						if (type === NotificationType.DM)
							ClientApi.redirect = new URL(MESSAGES_ROUTE + '/' + infos.author)
						if (type === NotificationType.NEWFRIEND || type === NotificationType.ACCEPTEDFRIEND)
							ClientApi.redirect = new URL(MYFRIENDS_EP)
					}}
					callbackFail={() => {
						infos.current = undefined
						setNotificationType(null)
					}} />
				}
				<div className="home-container">
					<div>
						<div className="title-container">
							<h1 className="famous">THE FAMOUS</h1>
							<h1 className="writepong"> PONG ┅┅</h1>
							<h1 className="game">  ┅┅ GAME </h1>
						</div>
						<div className="reglejeu-container">
							<p className="reglejeu">Choose your game mode and compete against your friends !</p>
						</div>
					</div>
					<div>
						<div className="button-container">
							<a href={GOPLAY_EP + '/classic'} className="classic-game">
								classic
							</a>
							<a href={GOPLAY_EP + '/medium'} className="medium-game">
								medium
							</a>
							<a href={GOPLAY_EP + '/hard'} className="hard-game">
								hard
							</a>
						</div>
					</div>
					<div>

					</div>
				</div>
			</div>
		)
	}




	return (
		<React.Fragment>
			{pseudo && getPage()}
			{pseudo === undefined && <ServerDownPage />}
		</React.Fragment>
	)
}
export default Home;

/*
si local storage n'a pas de token
	rediriger vers ma page /register (=> bouton qui sign in sur 42 : myUrl)
		Prendre la variable code pour l'envoyer au back (en parametre de la route /auth de notre api)
			Storer le token renvoyé du back
				Le sauvegarder dans le local storage
	
myUrl = https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e4321f4102944a4d6a845589617dc4dbb76d41480231e1640aa6a19b02a8a5a3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code 
*/