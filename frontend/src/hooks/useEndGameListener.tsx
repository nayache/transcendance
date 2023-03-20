import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { GameDto } from "../interface/IGame";


export const useEndGameListener = (
	socket: Socket | undefined,
	onEndGameListener?: (gameInfos: GameDto) => void
) => {

	const [isFinished, setIsFinished] = useState<boolean>(false)

	useEffect(() => {
		socket?.on('endGame', (gameInfos) => {
			console.log("(endGame) gameInfos = ", gameInfos)
			setIsFinished(true)
			if (onEndGameListener)
				onEndGameListener(gameInfos)
		})
		return () => {
			socket?.removeAllListeners('endGame')
		}
	}, [socket])

	return isFinished;
}
