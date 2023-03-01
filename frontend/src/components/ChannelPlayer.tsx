import '../styles/ChannelPlayer.css'

interface Props {
	playerName: string
}

const ChannelPlayer = ({ playerName }: Props) => {

	return (
		<div className="channelPlayer-container">
			<p>{playerName}</p>
		</div>
	)
}

export default ChannelPlayer