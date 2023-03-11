import { Status } from "../constants/EMessage";
import Avatar from "./Avatar"

interface Props {
	pseudo: string,
	animationDelay: number,
	avatar?: string,
	onClick?: () => void
}

const DMListItems = ({pseudo, avatar, animationDelay, onClick}: Props) => {


	return (
		<div
		style={{ animationDelay: `0.${animationDelay}s` }}
		onClick={onClick}
		className={`chatlist__item`}>
			<Avatar srcImg={avatar}/>
			<div className="userMeta">
				<p>{pseudo}</p>
			</div>
		</div>
	);
}

export default DMListItems