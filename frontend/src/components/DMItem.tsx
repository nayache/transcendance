import { Status } from "../constants/EMessage";
import Avatar from "./Avatar";

interface Props {
	animationDelay: number,
	key: string
	sender: string,
	msg: string
	image: string
}

const DMItem = ({ animationDelay, key, sender, msg, image }: Props) => {
	
	return (
		<div
			style={{ animationDelay: `0.8s` }}
			className={`chat__item ${sender ? sender : ""}`}
		>
			<div className="chat__item__content">
				<div className="chat__msg">{msg}</div>
				<div className="chat__meta">
					<span>16 mins ago</span>
					<span>Seen 1.03PM</span>
				</div>
			</div>
			<Avatar status={Status.INGAME} image={image} />
		</div>
	);
}

export default DMItem