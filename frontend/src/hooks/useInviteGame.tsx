import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { IGameInviteEv } from "../interface/IGame";


export const useInviteGame = (
	socket: Socket | undefined,
	onInviteGame: (data: IGameInviteEv) => void
) => {
	
	useEffect(() => {
		socket?.on('inviteGame', (data: IGameInviteEv) => {
			console.log("(inviteGame) data = ", data);
			if (onInviteGame)
				onInviteGame(data)
		})
		return () => {
			socket?.removeAllListeners('inviteGame')
		}
	}, [socket])

}