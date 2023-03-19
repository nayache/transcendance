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


const Home = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const socket = useSocket();
	const [isOkay, setIsOkay] = useState<boolean | undefined>();
	const infos = useRef<IMessageEvRecv | IFriendEv | undefined>(undefined);
	const [notificationType, setNotificationType] = useState<NotificationType | null>(null)
	const [modalGameType, setModalGameType] = useState<ModalGameType | null>(null)
	const inviteInfos = useRef<IGameInviteEv | null>(null)
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
	useInviteGame(socket, (data: IGameInviteEv) => {
		inviteInfos.current = {
			author: data.author,
			invited: data.invited,
			difficulty: data.difficulty
		}
		console.log("inviteInfos.current = ", inviteInfos.current)
		console.log("data = ", data)
		setModalGameType(ModalGameType.INVITED)
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
				{ modalGameType !== null && inviteInfos.current &&
					<ModalGameMenu active={modalGameType !== null} type={modalGameType}
					pseudo={pseudo} author={inviteInfos.current.author} difficulty={inviteInfos.current.difficulty}
					callback={async ({ response }) => {
						try {
							if (inviteInfos.current && response === false) {
								ClientApi.post(API_GAME_ACCEPT, JSON.stringify({
									target: inviteInfos.current.author,
									response: false
								}), 'application/json')
							}
							else if (inviteInfos.current && response === true) {
								ClientApi.redirect = new URL(GAMEPAGE_ROUTE + '/' + inviteInfos.current.difficulty + '/fromAccept/' + inviteInfos.current.author)
							}
						}
						catch (err) {
							console.log("err = ", err)
						}
						setModalGameType(null)
					}}
					callbackFail={({author}) => {
						try {
							if (author) {
								ClientApi.post(API_GAME_ACCEPT, JSON.stringify({
									target: author,
									response: false
								}), 'application/json')
							}
						}
						catch (err) {
							console.log("err = ", err)
						}
						setModalGameType(null)
					}}
					/>
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