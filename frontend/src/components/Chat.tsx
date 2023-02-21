import React from "react";
import Navbar from "./Navbar";
import '../styles/Chat.css'

const Chat = () => {

	return (
		<div>
			<Navbar />
			<div className="messages-container" />
			<div className="buttons-container">
				<div>
					<input type={"text"} />
					<button>Send</button>
				</div>
				<div>
					<button>General</button>
					<button>Humour</button>
					<button>Ranked</button>
					<button>Searching team</button>
					<button>Quick game</button>
				</div>
			</div>
		</div>
	);
}

export default Chat;