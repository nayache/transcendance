import "../styles/DMList.css"
import Logo1 from "../img/logo1.png"
import Logo2 from "../img/logo2.png"
import Logo3 from "../img/logo3.png"
import Logo4 from "../img/logo4.png"
import DMListItems from "./DMListItems"
import { useState } from "react"
import { Status } from "../constants/EMessage"
import { AiOutlinePlus } from "react-icons/ai"
// import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";


const DMList = () => {

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
			<button className="btn">
				<AiOutlinePlus />
				<span> New conversation</span>
			</button>
			<div className="chatlist__heading">
				<h2>Chats</h2>
				<button className="btn-nobg">
					{/* <FontAwesomeIcon icon={faEllipsisH} /> */}
				</button>
			</div>
			<div className="chatList__search">
				<div className="search_wrap">
					<input type="text" placeholder="Search Here" />
						{/* <FontAwesomeIcon icon={faMagnifyingGlass} /> */}
					<button className="search-btn">
					
					</button>
				</div>
			</div>
			<div className="chatlist__items">
				{allChats.map((item: any, index: number) => (
					<DMListItems
						name={item.name}
						key={item.id}
						animationDelay={index + 1}
						active={item.active ? "active" : ""}
						status={item.isOnline ? Status.ONLINE : Status.OFFLINE}
						image={item.image}
					/>
				))}
			</div>
		</div>
	)
}

export default DMList