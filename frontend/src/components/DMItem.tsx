import { Status } from "../constants/EMessage";
import Avatar from "./Avatar";
import { ChatItem, MessageStatus } from "./DM";
import '../styles/DMItem.css'
import { AiOutlineExclamationCircle } from "react-icons/ai"

interface Props {
	animationDelay: number,
	chatItem: ChatItem,
	tryAgain?: () => void
}

const DMItem = ({ animationDelay, chatItem, tryAgain }: Props) => {
	

	const statusClassNames = new Map<MessageStatus, string>([
		[MessageStatus.FAIL, "dm_failed"],
		[MessageStatus.LOADING, "dm_loading"],
		[MessageStatus.SENT, ""],
	])


	return (
		<div
			style={{ animationDelay: `0.8s` }}
			className={`chat__item ${chatItem.type ? chatItem.type : ""}`}
		>
			<div className="chat__item__content-container">
				<div className={`chat__item__content ${statusClassNames.get(chatItem.status)}`}>
					<div className="chat__msg">{chatItem.msg}</div>
					{chatItem.status === MessageStatus.SENT &&
					<div className="chat__meta">
						<span>16 mins ago</span>
						<span>Seen 1.03PM</span>
					</div>}
				</div>
				{chatItem.status === MessageStatus.FAIL &&
				<span className="retry-span" onClick={() => {
					if (tryAgain)
						tryAgain()
				}}>
					<AiOutlineExclamationCircle />Try to send again
				</span> }
			</div>
			<Avatar srcImg={chatItem.avatar} />
		</div>
	);
}

export default DMItem