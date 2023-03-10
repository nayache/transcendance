import { useEffect } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelEvMute, IChannelUser } from "../interface/IChannel"

export const useMuteUserUpdater = (
	socket: Socket | undefined, channels: IChannel[],
	currentChannelId: number, chanUser: IChannelUser | undefined,
	onMuteUserUpdate?: (payload: IChannelEvMute) => void
) => {
	
	
	useEffect(() => {
		if (chanUser?.pseudo) {
			socket?.on('muteUser', async (payload: IChannelEvMute) => {
				console.log("(punish) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.target)
				console.log("(punish) currentChannelId = ", currentChannelId)
				const daChannel: IChannel | undefined =
				channels.find(channel => channel.name === payload.channel)
				if (daChannel) { // impossible que daChannel soit undefined
					if (chanUser.pseudo === payload.target.pseudo) {
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
						&& channels[currentChannelId].name === payload.channel) {
							console.log("test ici en mute")
							if (onMuteUserUpdate)
								onMuteUserUpdate(payload)
						}
					}
					else if (chanUser.pseudo === payload.author.pseudo) {
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
						&& channels[currentChannelId].name === payload.channel) {
							console.log("test ici en mute")
							if (onMuteUserUpdate)
								onMuteUserUpdate(payload)
						}
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('muteUser')
		}
	}, [socket, chanUser, currentChannelId])
}
