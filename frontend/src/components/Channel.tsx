import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { setCurrentChannel } from "../redux/channelsSlice"

interface Props {
	channelName: string,
}

const Channel = ({ channelName }: Props) => {

	const dispatch = useDispatch()

	const handleClick = useCallback(() => {
		dispatch(setCurrentChannel(channelName))
	}, [dispatch])



	return (
		<div>
			<button onClick={handleClick}>{channelName}</button>
		</div>
	)
}

export default Channel;