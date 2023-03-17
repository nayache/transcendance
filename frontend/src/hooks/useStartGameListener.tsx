import { useEffect } from "react";
import { Socket } from "socket.io-client";
import BallDisplayer from "../components/BallDisplayer.class";
import PlayerDisplayer from "../components/PlayerDisplayer.class";
import { MoveObject, MoveObjects } from "../interface/IGame";


export const useStartGameListener = (
	socket: Socket | undefined,
	leftPlayer: PlayerDisplayer,
	rightPlayer: PlayerDisplayer,
	ball: BallDisplayer,
	onPreStartGame?: (props?: any) => void,
	onStartGame?: (props?: any) => void,
) => {

	useEffect(() => {
		socket?.on('preStartGame', ({leftPaddle, rightPaddle, ball: _ball}: MoveObjects) => {
			// try {
				leftPlayer.paddle.display(leftPaddle)
				rightPlayer.paddle.display(rightPaddle)
				ball.display(_ball)
				if (onPreStartGame)
					onPreStartGame({leftPaddle, rightPaddle, ball: _ball})
			// }
			// catch (err) {
			// 	console.log("err = ", err)
			// }
		})
		return () => {
			socket?.removeAllListeners('preStartGame')
		}
	}, [socket])

	useEffect(() => {
		socket?.on('startGame', () => {
			try {
				if (onStartGame)
					onStartGame()
			}
			catch (err) {				
				console.log("err = ", err)
			}
		})
		return () => {
			socket?.removeAllListeners('startGame')
		}
	}, [socket])
}