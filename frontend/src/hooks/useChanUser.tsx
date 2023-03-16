import { useEffect, useState } from "react"
import { IChannel, IChannelUser } from "../interface/IChannel"


export const useChanUser = (pseudo: string | undefined, channels: IChannel[], currentChannelId: number) => {

	const [chanUser, setChanUser] = useState<IChannelUser>()

	useEffect(() => {
		if (pseudo && !(currentChannelId <= -1 || currentChannelId >= channels.length)) {
			setChanUser(channels[currentChannelId].users
				.filter(user => user.pseudo === pseudo)[0])
		}
	}, [pseudo, channels, currentChannelId])

	return chanUser
}