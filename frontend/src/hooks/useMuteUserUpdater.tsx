import { useEffect } from "react"
import { Socket } from "socket.io-client"
import { IChannel, IChannelEvJoin, IChannelEvLeave, IChannelUser } from "../interface/IChannel"

export const useJoinRoomUpdater = (
	socket: Socket | undefined, chanUser: IChannelUser | undefined,
	updateChannel: (channel: IChannel) => void,
	currentChannelId: number, channels: IChannel[],
	onJoinRoomUpdate?: (payload: IChannelEvJoin) => void
) => {
	
	
	useEffect(() => {
		if (chanUser?.pseudo) {
			socket?.on('joinRoom', (payload: IChannelEvJoin) => {
				console.log("(join) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.user.pseudo)
				console.log("(join) currentChannelId = ", currentChannelId)
				if (payload.user.pseudo !== chanUser.pseudo && !(currentChannelId <= -1 || currentChannelId >= channels.length)
				&& channels[currentChannelId].name === payload.channel) {
					const users: IChannelUser[] = channels[currentChannelId].users.map(user => user)
					if (users.every(user => user.pseudo !== payload.user.pseudo)) // contre les bugs graphiques
						users.push(payload.user)
					const channel: IChannel = {
						name: channels[currentChannelId].name,
						users,
						prv: channels[currentChannelId].prv,
						password: channels[currentChannelId].password,
						messages: channels[currentChannelId].messages,
					}
					updateChannel(channel)
					console.log("test ici en join")
					if (onJoinRoomUpdate)
						onJoinRoomUpdate(payload)
				}
			})
		}
		return () => {
			socket?.removeAllListeners('joinRoom')
		}
	}, [socket, chanUser, currentChannelId])
}
