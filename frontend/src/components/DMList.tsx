import "../styles/DMList.css"
import Logo1 from "../img/logo1.png"
import Logo2 from "../img/logo2.png"
import Logo3 from "../img/logo3.png"
import Logo4 from "../img/logo4.png"
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
	discussions: Discussion[]
	updateReceiver: (receiver: IUser) => void,
}

const DMList = ({discussions, updateReceiver}: Props) => {

	const [ doPrintModal, setDoPrintModal ] = useState<boolean>(false)
	


	return (
		<div className="main__chatlist">
			<button className="btn" onClick={() => setDoPrintModal(true)}>
				<AiOutlinePlus />
				<span> New conversation</span>
			</button>
			{ doPrintModal &&
				<ModalDMMenu active={doPrintModal} type={ModalDMType.CHOOSERECEIVER}
				callback={(user) => {
					updateReceiver(user)
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
				{discussions.map((item, index) => (
					<DMListItems
						pseudo={item.pseudo}
						avatar={item.avatar}
						onClick={() => updateReceiver({pseudo: item.pseudo, avatar: item.avatar})}
						animationDelay={index + 1}
					/>
				))}
			</div>
		</div>
	)
}

export default DMList