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
// import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";


interface Props {
	updateReceiver: (receiver: IUser) => void
}

const DMList = ({updateReceiver}: Props) => {

	const [ doPrintModal, setDoPrintModal ] = useState<boolean>(false)
	const [allChats, setAllChats] = useState([
		{
			name: "Guillaumedu77",
			image: <img className="imgid1" src={Logo1}/>,
			active: false,
			isOnline: true,
			id: 1,
		},
		{
			name: "Leodu69",
			image: <img className="imgid2" src={Logo2}/>,
			active: false,
			isOnline: false,
			id: 2,
		},
		{
			name: "Manondu62",
			image: <img className="imgid3" src={Logo4}/>,
			active: false,
			isOnline: true,
			id: 3,
		},
		{
			name: "AlanTiaCapté",
			image: <img className="imgid4" src={Logo3}/>,
			active: false,
			isOnline: true,
			id: 4,
		},
	])


	return (
		<div className="main__chatlist">
			<button className="btn" onClick={() => setDoPrintModal(true)}>
				<AiOutlinePlus />
				<span> New conversation</span>
			</button>
			{
				<ModalDMMenu active={doPrintModal} type={ModalDMType.CHOOSERECEIVER}
				callback={(userName) => {setDoPrintModal(false); console.log("userName = ", userName)}}
				callbackFail={() => setDoPrintModal(false)} />
			}
			<div className="chatlist__heading">
				<h2>Chats</h2>
				<button className="btn-nobg">
					{/* <FontAwesomeIcon icon={faEllipsisH} /> */}
				</button>
			</div>
			<div className="chatlist__items">
				{allChats.map((item: any, index: number) => (
					<DMListItems
						name={item.name}
						key={item.id}
						animationDelay={index + 1}
						srcImg={item.image}
					/>
				))}
			</div>
		</div>
	)
}

export default DMList