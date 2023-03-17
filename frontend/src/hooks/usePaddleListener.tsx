// import { useEffect } from "react";
// import { Socket } from "socket.io-client";
// import PlayerDisplayer from "../components/PlayerDisplayer.class";
// import { MoveObject } from "../interface/IGame";

// export const usePaddleListener = (
// 	socket: Socket | undefined,
// 	leftPlayer: PlayerDisplayer,
// 	rightPlayer: PlayerDisplayer,
// ) => {

// 	useEffect(() => {
// 		socket?.on('paddleEvent', (moveObj: MoveObject) => {
// 			if (socket.id === moveObj.userId) {
// 				leftPlayer.paddle.display(moveObj)
// 			}
// 			else {
// 				rightPlayer.paddle.display(moveObj)
// 			}
// 		})
// 		return () => {
// 			socket?.removeAllListeners('paddleEvent')
// 		}
// 	}, [socket])
// }
export const usea = () => {}