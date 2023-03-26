import { useEffect } from "react"
import { Socket } from "socket.io-client"
import { IChannel, IChannelEvLeave, IChannelUser } from "../interface/IChannel"



export const useLeaveRoomUpdater = (
	socket: Socket | undefined, chanUser: IChannelUser | undefined,
	updateChannel: (channel: IChannel) => void,
	currentChannelId: number, channels: IChannel[],
	onLeaveRoomUpdate?: (payload: IChannelEvLeave) => void
) => {

	useEffect(() => {
		if (chanUser?.pseudo) {
			socket?.on('leaveRoom', (payload: IChannelEvLeave) => {

				// console.log("(leave) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.pseudo)
				// console.log("(leave) currentChannelId = ", currentChannelId)
				if (payload.pseudo !== chanUser.pseudo
				&& !(currentChannelId <= -1 || currentChannelId >= channels.length)
				&& channels[currentChannelId].name === payload.channel) {
					const users: IChannelUser[] = channels[currentChannelId].users
					.filter(user => user.pseudo !== payload.pseudo)
					const channel: IChannel = {
						name: channels[currentChannelId].name,
						users,
						prv: channels[currentChannelId].prv,
						password: channels[currentChannelId].password,
						messages: channels[currentChannelId].messages,
					}
					updateChannel(channel)
					// console.log("test ici en leave")
					if (onLeaveRoomUpdate)
						onLeaveRoomUpdate(payload)
				}
			})
		}
		return () => {
			socket?.removeAllListeners('leaveRoom')
		}
	}, [socket, chanUser, currentChannelId])
}
