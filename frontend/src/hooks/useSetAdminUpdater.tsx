import { useEffect } from "react"
import { Socket } from "socket.io-client"
import { IChannel, IChannelEvSetAdmin, IChannelUser } from "../interface/IChannel"

export const useSetAdminUpdater = (
	socket: Socket | undefined, chanUser: IChannelUser | undefined,
	updateChannel: (channel: IChannel) => void,
	currentChannelId: number, channels: IChannel[],
	onSetAdminUpdate?: (payload: IChannelEvSetAdmin) => void
) => {
	
	
	useEffect(() => {
		if (chanUser?.pseudo) {
			socket?.on('setAdmin', (payload: IChannelEvSetAdmin) => {
				console.log("(punish) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.target)
				console.log("(punish) currentChannelId = ", currentChannelId)
				const daChannel: IChannel | undefined =
				channels.find(channel => channel.name === payload.channel)
				if (daChannel) { // impossible que daChannel soit undefined
					const users: IChannelUser[] = daChannel.users
					const channel: IChannel = {
						name: daChannel.name,
						users: users.map((user, index) => {
							const daIndex: number = users.findIndex(user => user.pseudo === payload.target.pseudo);
							if (index === daIndex)
								return payload.target
							return user
						}),
						prv: daChannel.prv,
						password: daChannel.password,
						messages: daChannel.messages,
					}
					updateChannel(channel)
					if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
					&& channels[currentChannelId].name === payload.channel) {
						console.log("test ici en punish")
						if (onSetAdminUpdate)
							onSetAdminUpdate(payload)
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('setAdmin')
		}
	}, [socket, chanUser, currentChannelId])
}
