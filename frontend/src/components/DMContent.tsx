import { useState } from "react";
import "../styles/DMContent.css"
import Avatar from "./Avatar";
import DMItem from "./DMItem";
import avatar from "../img/avatar2.jpeg"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { faCog } from "@fortawesome/free-solid-svg-icons";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import person from "../img/logo3.png"
import { Status } from "../constants/EMessage";

const DMContent = () => {

	const [chatItems, setChatItems] = useState([
		{
			key: 1,
			image: <img className="Avatarme" src={avatar}/>,
			type: "",
			msg: "Hi Timhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnh klcfmb,mclfdkjimhjdglkjdlrgkmldkbmdlkznfbxkldjnhklcfmb,mclfdkjb, How are you?",
		},
		{
			key: 2,
			image: <img className="Avatarme" src={person}/>,
			type: "other",
			msg: "I am fine.",
		},
		{
			key: 3,
			image: <img className="Avatarme" src={avatar}/>,
			type: "other",
			msg: "What about you?",
		},
		{
			key: 4,
			image: <img className="Avatarme" src={person}/>,
			type: "",
			msg: "Awesome these days.",
		},
		{
			key: 5,
			image: <img className="Avatarme" src={avatar}/>,
			type: "other",
			msg: "Finally. What's the plan?",
		},
		{
			key: 6,
			image: <img className="Avatarme" src={person}/>,
			type: "",
			msg: "what plan mate?",
		},
		{
			key: 7,
			image: <img className="Avatarbg" src={avatar}/>,
			type: "other",
			msg: "I'm taliking about the tutorial",
		},
	])
	
	// useEffect(() => {
	// 	window.addEventListener("keydown", (e) => {
	// 		if (e.keyCode == 13) {
	// 		if (this.state.msg != "") {
	// 			this.chatItms.push({
	// 			key: 1,
	// 			type: "",
	// 			msg: this.state.msg,
	// 			image: <img className="Avatarother" src={avatar}/>
	// 			});
	// 			this.setState({ chat: [...this.chatItms] });
	// 			this.scrollToBottom();
	// 			this.setState({ msg: "" });
	// 		}
	// 		}
	// 	});
	// 	this.scrollToBottom();
	// }, [])

	// onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// this.setState({ msg: e.target.value });
	// };
	
	return (
		<div className="main__chatcontent">
			<div className="content__header">
				<div className="blocks">
					<div className="current-chatting-user">
						<Avatar
						status={Status.ONLINE}
						image={person}
						/>
						<p>AlanTiaCapté</p>
					</div>
				</div>
				<div className="blocks">
					<div className="settings">
						<button className="btn-nobg">
							{/* <FontAwesomeIcon icon={faCog}/> */}
						</button>
					</div>
				</div>
			</div>
			<div className="content__body">
				<div className="chat__items">
					{chatItems.map((itm: any, index: number) => {
						return (
						<DMItem
							animationDelay={index + 2}
							key={itm.key}
							sender={itm.type ? itm.type : "me"}
							msg={itm.msg}
							image={itm.image}
						/>
						);
					})}
					<div></div>
				</div>
			</div>
			<div className="content__footer">
				<div className="sendNewMessage">
				<button className="addFiles">
					{/* <FontAwesomeIcon className="faPlusNM" icon={faPlus}/> */}
				</button>
				<input
					type="text"
					placeholder="Type a message here"
					// onChange={this.onStateChange}
					// value={this.state.msg}
				/>
				<button className="btnSendMsg" id="sendMsgBtn">
					{/* <FontAwesomeIcon icon={faPaperPlane}/> */}
				</button>
				</div>
			</div>
		</div>
	);
}

export default DMContent