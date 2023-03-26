import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { GameDto } from "../interface/IGame";


export const useUpdateScoreListener = (
	socket: Socket | undefined,
	infos: GameDto,
	onUpdateScore?: (score: [number, number]) => void
) => {

	const [score, setScore] = useState<[number, number]>([infos.score1, infos.score2])

	useEffect(() => {
		socket?.on('updateScore', (score: [number, number]) => {
			// console.log("(updateScore) score = ", score)
			setScore(score)
			if (onUpdateScore)
				onUpdateScore(score)
		})
		return () => {
			socket?.removeAllListeners('updateScore')
		}
	}, [socket])

	return score;
}
