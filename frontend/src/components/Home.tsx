import React, { useEffect, useRef, useState } from "react"
import { API_GAME_ACCEPT, API_PSEUDO_ROUTE, GAMEPAGE_EP, GAMEPAGE_ROUTE, GOPLAY_EP, MESSAGES_ROUTE, MYFRIENDS_EP, REGISTER_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
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
import { useInviteGame } from "../hooks/useInviteGame";
import ModalGameMenu, { ModalGameType } from "./ModalGameMenu";
import { IGameInviteEv } from "../interface/IGame";
import { useNotification } from "../hooks/useNotification";
import { useInviteNotification } from "../hooks/useInviteNotification";


const Home = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const socket = useSocket();
	const notification = useNotification(socket, {pseudo, avatar})
	const inviteNotification = useInviteNotification(socket, pseudo)
	const [isOkay, setIsOkay] = useState<boolean | undefined>();
	




	const getPage = () => {
		
	//ajout de classements
	//historique des dernieres parties
	//(et si c pas trop chaud, chat general)

		return (
			<div>
				<Navbar/>
				{ notification }
				{ inviteNotification }
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
							<a href={GAMEPAGE_ROUTE + '/easy'} className="easy-game">
								easy
							</a>
							<a href={GAMEPAGE_ROUTE + '/medium'} className="medium-game">
								medium
							</a>
							<a href={GAMEPAGE_ROUTE + '/hard'} className="hard-game">
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