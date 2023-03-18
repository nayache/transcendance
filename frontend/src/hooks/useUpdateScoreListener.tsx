import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";


export const useUpdateScoreListener = (
	socket: Socket | undefined,
	onUpdateScore?: (score: [number, number]) => void
) => {

	const [score, setScore] = useState<[number, number]>([0, 0])

	useEffect(() => {
		socket?.on('updateScore', (score: [number, number]) => {
			console.log("(updateScore) score = ", score)
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