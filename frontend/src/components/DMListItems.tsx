import { useRef } from "react";
import { Status } from "../constants/EMessage";
import { useResizeText } from "../hooks/useResizeText";
import Avatar from "./Avatar"

interface Props {
	pseudo: string,
	animationDelay: number,
	unread: number,
	avatar?: string,
	onClick?: () => void
}

const DMListItems = ({pseudo, avatar, unread, animationDelay, onClick}: Props) => {

	const pseudoRef = useResizeText(useRef<HTMLParagraphElement>(null))

	return (
		<div
		style={{ animationDelay: `0.${animationDelay}s` }}
		onClick={onClick}
		className={`chatlist__item`}>
			<Avatar srcImg={avatar}/>
			<div className="userMeta">
				<p ref={pseudoRef}>{pseudo}</p>
				{unread > 0 &&
				<div className="unread-div">
					<p>({unread})</p>
				</div>}
			</div>
		</div>
	);
}

export default DMListItems