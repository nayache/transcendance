import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelEvMute, IChannelUser } from "../interface/IChannel"

/* peut etre faire un setinterval toutes les 3min */
export const useStatusUserUpdater = (
	socket: Socket | undefined, channels: IChannel[],
	currentChannelId: number, chanUser: IChannelUser | undefined,
	onStatusUserUpdate?: (payload: IChannelEvMute) => void
): [string, Date] | undefined => {
	
	const [expiration, setExpiration] = useState<[string, Date]>();
	
	useEffect(() => {
		if (chanUser?.pseudo) {
			socket?.on('muteUser', async (payload: IChannelEvMute) => {
				console.log("(status) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.target)
				console.log("(status) currentChannelId = ", currentChannelId)
				const daChannel: IChannel | undefined =
				channels.find(channel => channel.name === payload.channel)
				if (daChannel) { // impossible que daChannel soit undefined
					if (chanUser.pseudo === payload.target.pseudo) {
						setExpiration([daChannel.name, new Date(payload.expiration)])
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
						&& channels[currentChannelId].name === payload.channel) {
							payload.expiration = new Date(payload.expiration)
							console.log("test ici en status")
							if (onStatusUserUpdate)
								onStatusUserUpdate(payload)
						}
					}
					else if (chanUser.pseudo === payload.author.pseudo) {
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
						&& channels[currentChannelId].name === payload.channel) {
							console.log("test ici en status")
							payload.expiration = new Date(payload.expiration)
							if (onStatusUserUpdate)
								onStatusUserUpdate(payload)
						}
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('muteUser')
		}
	}, [socket, chanUser, currentChannelId])
	return expiration;
}
