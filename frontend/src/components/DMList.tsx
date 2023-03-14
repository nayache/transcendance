import "../styles/DMList.css"
import DMListItems from "./DMListItems"
import { useState } from "react"
import { Status } from "../constants/EMessage"
import { AiOutlinePlus } from "react-icons/ai"
import ModalDMMenu, { ModalDMType } from "./ModalDMMenu"
import { ModalChannelType } from "./ModalChannelMenu"
import { IUser } from "../interface/IUser"
import { Discussion } from "../interface/IMessage"
// import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";


interface Props {
	user: IUser | undefined,
	discussions: Discussion[],
	updateDiscussions: (pseudo: string, position: number, unread: number, avatar?: string) => void,
	updateReceiver: (receiver: IUser) => void,
}

const DMList = ({user, discussions, updateDiscussions, updateReceiver}: Props) => {

	const [ doPrintModal, setDoPrintModal ] = useState<boolean>(false)
	


	return (
		<div className="main__chatlist">
			<button className="btn" onClick={() => setDoPrintModal(true)}>
				<AiOutlinePlus />
				<span> New conversation</span>
			</button>
			{ doPrintModal &&
				<ModalDMMenu active={doPrintModal} type={ModalDMType.CHOOSERECEIVER}
				user={user}
				callback={(user) => {
					updateReceiver(user)
					updateDiscussions(user.pseudo, 0, 0, user.avatar)
					setDoPrintModal(false);
				}}
				callbackFail={() => setDoPrintModal(false)} />
			}
			<div className="chatlist__heading">
				<h2>Chats</h2>
				<button className="btn-nobg">
					{/* <FontAwesomeIcon icon={faEllipsisH} /> */}
				</button>
			</div>
			<div className="chatlist__items">
				{ discussions &&
				discussions.map((item, index) => (
					<DMListItems
						key={index}
						pseudo={item.pseudo}
						avatar={item.avatar}
						unread={item.unread}
						onClick={() => updateReceiver({pseudo: item.pseudo, avatar: item.avatar})}
						animationDelay={index + 1}
					/>
				))}
			</div>
		</div>
	)
}

export default DMList