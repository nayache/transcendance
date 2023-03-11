import React from "react";
import "../styles/DM.css"
import DMContent from "./DMContent";
import DMList from "./DMList";
import UserProfileChat from "./DMUserProfile";
import Navbar from "./Navbar";

const DM = () => {

	return (
		<React.Fragment>
			<Navbar />
			<div className="DM-container">
				<DMList />
				<DMContent />
			</div>
		</React.Fragment>
	)
}

export default DM