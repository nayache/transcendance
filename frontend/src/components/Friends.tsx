import React, { useEffect, useState } from "react"
import Navbar from "./Navbar"
import "../styles/Friends.css"
import "../styles/Pendings.css"
import DefaultImg from "../img/avatar2.jpeg"
import { Relation } from "../interface/IUser"
import { Status } from "../constants/EMessage"
import ClientApi from "./ClientApi.class"
import { API_USER_FRIENDS_LIST } from "../constants/RoutesApi"

interface Friend {
    pseudo: string,
    status: Status,
	avatar?: string,
}

interface Pending {
    pseudo: string,
	avatar?: string,
}

const Friends = () => {
	


	const [friends, setFriends] = useState<Friend[]>([])
	const [pendings, setPendings] = useState<Pending[]>([])




	const printFriends = (friends: Friend[]) => {
		const circleStatus = new Map<Status, string>([
			[Status.OFFLINE, "offline"],
			[Status.INGAME, "ingame"],
			[Status.ONLINE, "online"],
		])
	
		const res: JSX.Element[] = friends.map((friend: Friend, i) => {

			return (
				<div key={i} className="friendsTab">
					<button>
						<img className="Avatarbg" src={friend.avatar ? friend.avatar : DefaultImg} />
						{friend.pseudo}
						<div className={`circle ${circleStatus.get(friend.status)}`}/>
					</button>
				</div>
			)
		})
		return res;
	}

	const printPendings = (pendings: Pending[]) => {
	
		const res: JSX.Element[] = pendings.map((pending: Pending, i) => {

			return (
				<div key={i} className="pendingsTab">
					<button>
						<img className="Avatarbg" src={pending.avatar ? pending.avatar : DefaultImg} />
						{pending.pseudo}
						<div>confirmer ou refuser</div>
					</button>
				</div>
			)
		})
		return res;
	}



	useEffect(() => {
		(async () => {
			try {
				const data: { friends: Friend[], pendings: Pending[] } =
					await ClientApi.get(API_USER_FRIENDS_LIST)
				console.log("data = ", data)
				setFriends(data.friends)
				setPendings(data.pendings)
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [])




	return (
		<div>
			<Navbar/>
			<div className="friends">
				<div className="friends-container">
					<h1>Friends</h1>
					{printFriends(friends)}
				</div>
				<div className="pendings-container">
					{printPendings(pendings)}
				</div>
			</div>
		</div>
	)
}

export default Friends