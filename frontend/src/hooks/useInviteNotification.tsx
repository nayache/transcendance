import React, { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import ModalGameMenu, { ModalGameType } from "../components/ModalGameMenu"
import { API_GAME_ACCEPT, GAMEPAGE_ROUTE } from "../constants/RoutesApi"
import { IGameInviteEv } from "../interface/IGame"
import { useInviteGame } from "./useInviteGame"


export const useInviteNotification = (
	socket: Socket | undefined,
	pseudo: string | undefined,
) => {
	
	const [modalGameType, setModalGameType] = useState<ModalGameType | null>(null)
	const [inviteInfos, setInviteInfos] = useState<IGameInviteEv | null>(null)


	useInviteGame(socket, (data: IGameInviteEv) => {
		setInviteInfos({
			author: data.author,
			invited: data.invited,
			difficulty: data.difficulty
		})
		console.log("inviteInfos = ", inviteInfos)
		console.log("data = ", data)
		setModalGameType(ModalGameType.INVITED)
	})


	
	useEffect(() => () => {
		console.log("less clean up that")
		if (inviteInfos) {
			console.log("inviteInfos = ", inviteInfos)
			try {
				if (inviteInfos.author) {
					ClientApi.post(API_GAME_ACCEPT, JSON.stringify({
						target: inviteInfos.author,
						response: false
					}), 'application/json')
				}
			}
			catch (err) {
				console.log("err = ", err)
			}
			setModalGameType(null)
		}
	}, [])



	return (
		<React.Fragment>
			{ modalGameType !== null && inviteInfos &&
				<ModalGameMenu active={modalGameType !== null} type={modalGameType}
				pseudo={pseudo} author={inviteInfos.author} difficulty={inviteInfos.difficulty}
				callback={async ({ response }) => {
					try {
						if (inviteInfos && response === false) {
							ClientApi.post(API_GAME_ACCEPT, JSON.stringify({
								target: inviteInfos.author,
								response: false
							}), 'application/json')
						}
						else if (inviteInfos && response === true) {
							ClientApi.redirect = new URL(GAMEPAGE_ROUTE + '/' + inviteInfos.difficulty + '/fromAccept/' + inviteInfos.author)
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
		</React.Fragment>
	)
}