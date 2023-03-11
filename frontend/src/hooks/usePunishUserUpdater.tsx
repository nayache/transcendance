import { useEffect } from "react"
import { Socket } from "socket.io-client"
import ClientApi from "../components/ClientApi.class"
import { API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi"
import { IChannel, IChannelEvPunish, IChannelUser } from "../interface/IChannel"

export const usePunishUserUpdater = (
	socket: Socket | undefined, channels: IChannel[],
	currentChannelId: number, chanUser: IChannelUser | undefined,
	updateChannel: (channel: IChannel) => void,
	removeChannel: (channelName: string, genUpdated: IChannel | null) => void,
	setCurrentChannel: (channelName: string) => void,
	onPunishUserUpdate?: (payload: IChannelEvPunish) => void
) => {
	
	
	useEffect(() => {
		if (chanUser?.pseudo) {
			socket?.on('punishUser', async (payload: IChannelEvPunish) => {
				console.log("(punish) pseudo = ", chanUser.pseudo, " et paypseudo = ", payload.target)
				console.log("(punish) currentChannelId = ", currentChannelId)
				console.log("(punish) payload = ", payload)
				const daChannel: IChannel | undefined =
				channels.find(channel => channel.name === payload.channel)
				console.log("(punish) channels.map(channel => channel.name) = ", channels.map(channel => channel.name))
				if (daChannel) { // impossible que daChannel soit undefined
					console.log("daChannel = ", daChannel)
					const users: IChannelUser[] = daChannel.users
						.filter(user => user.pseudo !== payload.target)
					const channel: IChannel = {
						name: daChannel.name,
						users,
						prv: daChannel.prv,
						password: daChannel.password,
						messages: daChannel.messages,
					}
					if (chanUser.pseudo === payload.target) {
						let genUpdated: IChannel | null = null;
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
							&& channels[currentChannelId].name === payload.channel) {
							
							try {
								const data: { channel: IChannel } =
								await ClientApi.get(API_CHAT_CHANNEL_ROUTE + '/General')
								genUpdated = data.channel
								console.log("genUpdated (a peine apres) = ", genUpdated);
							} catch (err) {
								console.log("err = ", err);
							}
						}
						console.log("genUpdated (apres) = ", genUpdated);
						removeChannel(payload.channel, genUpdated)
						if (onPunishUserUpdate)
							onPunishUserUpdate(payload)
					}
					else if (payload.target !== chanUser.pseudo) {
						updateChannel(channel)
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
						&& channels[currentChannelId].name === payload.channel) {
							console.log("test ici en punish")
							if (onPunishUserUpdate)
								onPunishUserUpdate(payload)
						}
					}
				}
				else { // si c vraiment undefined (et on est encore dans le punishUser) donc le channel du gars est deja remove
					if (chanUser.pseudo === payload.target) {
						let genUpdated: IChannel | null = null;
						if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
							&& channels[currentChannelId].name === payload.channel) {
							
							try {
								const data: { channel: IChannel } =
								await ClientApi.get(API_CHAT_CHANNEL_ROUTE + '/General')
								genUpdated = data.channel
								console.log("genUpdated (a peine apres) = ", genUpdated);
							} catch (err) {
								console.log("err = ", err);
							}
						}
						console.log("genUpdated (apres) = ", genUpdated);
						removeChannel(payload.channel, genUpdated)
						if (onPunishUserUpdate)
							onPunishUserUpdate(payload)
					}
				}
			})
		}
		return () => {
			socket?.removeAllListeners('punishUser')
		}
	}, [socket, chanUser, currentChannelId])
}
