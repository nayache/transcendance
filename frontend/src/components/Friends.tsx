import React from "react"
import Navbar from "./Navbar"
import "../styles/Friends.css"
import Logo1 from "../img/logo1.png"
import Logo2 from "../img/logo2.png"
import Logo3 from "../img/logo3.png"
import Logo4 from "../img/logo4.png"

interface Friend {
    pseudo: string,
    status: string,
	avatar:  JSX.Element,
}

const Friends = () => {
	
	const friends: Friend[] = [
		{
			pseudo: "Guillaumedu77",
			status: "En ligne",
			avatar: <img className="Avatarbg" src={Logo1}/>,
		},
		{
			pseudo: "Leodu69",
			status: "Hors ligne",
			avatar: <img className="Avatarbg" src={Logo2}/>,
		},
		{
			pseudo: "Manondu62",
			status: "Hors ligne",
			avatar: <img className="Avatarbg" src={Logo4}/>,
		},
		{
			pseudo: "AlanTiaCapté",
			status: "En pleine partie",
			avatar: <img className="Avatarbg" src={Logo3}/>,
		},
		]

	const printFriends = () => {
		const res: JSX.Element[] = friends.map((friend: Friend) => {
		let colorcircle;
		if (friend.status == "En ligne")
			colorcircle = "moncercle online"
		else if (friend.status == "Hors ligne")
			colorcircle = " moncercle offline"
		else if (friend.status == "En pleine partie")
			colorcircle = "moncercle  ingame"

			return (
				<div className="friendsTab">
					<button>
						{friend.avatar}
						{friend.pseudo}
						<div className={colorcircle}/>
					</button>

				</div>
			)
		})
			return res;
		}

	return (
		<div>
			<Navbar/>
			<div className="friends">
				<h1>Friends</h1>
				{printFriends()}
			</div>
		</div>
	)
}

export default Friends