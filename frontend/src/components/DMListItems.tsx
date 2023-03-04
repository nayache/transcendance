import { Status } from "../constants/EMessage";
import Avatar from "./Avatar"

interface Props {
	name: string,
	key: number,
	animationDelay: number,
	active: string,
	status: Status,
	image: string,
}

const DMListItems = ({name, key, animationDelay, active, status, image}: Props) => {

	const selectChat = (e: any) => {
		for (
			let index = 0;
			index < e.currentTarget.parentNode.children.length;
			index++
		) {
			e.currentTarget.parentNode.children[index].classList.remove("active");
		}
		e.currentTarget.classList.add("active");
	};

	return (
		<div
		style={{ animationDelay: `0.${animationDelay}s` }}
		// onClick={selectChat}
		className={`chatlist__item ${
			active ? active : ""
		} `}>
			<Avatar image={image} status={status}/>
			<div className="userMeta">
				<p>{name}</p>
				<span className="activeTime">32 mins ago</span>
			</div>
		</div>
	);
}

export default DMListItems