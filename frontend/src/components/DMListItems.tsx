import { Status } from "../constants/EMessage";
import Avatar from "./Avatar"

interface Props {
	name: string,
	key: number,
	animationDelay: number,
	srcImg: string,
}

const DMListItems = ({name, key, animationDelay, srcImg}: Props) => {


	return (
		<div
		style={{ animationDelay: `0.${animationDelay}s` }}
		// onClick={selectChat}
		className={`chatlist__item`}>
			<Avatar srcImg={srcImg}/>
			<div className="userMeta">
				<p>{name}</p>
			</div>
		</div>
	);
}

export default DMListItems