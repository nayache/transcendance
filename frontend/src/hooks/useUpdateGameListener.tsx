import { useEffect } from "react";
import { Socket } from "socket.io-client";
import PlayerDisplayer from "../components/PlayerDisplayer.class";
import { MoveObject, MoveObjects } from "../interface/IGame";

export const useUpdateGameListener = (
	socket: Socket | undefined,
	onUpdateGame?: (moveObjects: MoveObjects) => void
) => {

	useEffect(() => {
		socket?.on('updateGame', (moveObjects: MoveObjects) => {
			if (onUpdateGame)
				onUpdateGame(moveObjects)
		})
		return () => {
			socket?.removeAllListeners('updateGame')
		}
	}, [socket])
}