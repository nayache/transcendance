import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { IChannelUser } from "../interface/IChannelUser"
import { RootState } from "../redux/store"


export const useChanUser = (pseudo: string | undefined) => {

	const [chanUser, setChanUser] = useState<IChannelUser>()
	const { channels, currentChannelId } = useSelector((state: RootState) => state.room)

	useEffect(() => {
		console.log("currentChannelId = ", currentChannelId);
		if (pseudo && currentChannelId !== -1) {
			setChanUser(channels[currentChannelId].users
				.filter(user => user.pseudo === pseudo)[0])
		}
	}, [pseudo, currentChannelId])

	return chanUser
}