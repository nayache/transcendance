import React, { useEffect, useState } from "react"
import Navbar from "./Navbar"
import "../styles/Friends.css"
import "../styles/Pendings.css"
import DefaultImg from "../img/avatar2.jpeg"
import { Relation } from "../interface/IUser"
import { Status } from "../constants/EMessage"
import ClientApi from "./ClientApi.class"
import { API_USER_ADD_FRIEND, API_USER_BLOCK, API_USER_DEL_FRIEND, API_USER_FRIENDS_LIST, PROFILE_EP, PROFILE_ROUTE } from "../constants/RoutesApi"
import { BsCheck2 } from "react-icons/bs"
import { RxCross1 } from "react-icons/rx"
import { ImCross } from "react-icons/im"
import { usePseudo } from "../hooks/usePseudo"
import { useNewFriendReqListener } from "../hooks/useNewFriendReqListener"
import { useSocket } from "../hooks/useSocket"
import { useNewFriendAccListener } from "../hooks/useFriendAccUpdater"

export interface Friend {
    pseudo: string,
    status: Status,
	avatar?: string,
}

export interface Pending {
    pseudo: string,
	avatar?: string,
}

const Friends = () => {
	

	const socket = useSocket()
	const pseudo = usePseudo()
	const [friends, setFriends] = useState<Friend[]>([])
	const [pendings, setPendings] = useState<Pending[]>([])
	const[isOpen, setIsOpen] = useState(true);
	useNewFriendReqListener(socket, pseudo, (pending: Pending) => {
		setPendings(pendings => [...pendings,
			pending
		])
	})
	useNewFriendAccListener(socket, pseudo, (friend: Friend) => {
		setFriends(friends => [...friends,
			friend
		])
	})



	const printFriends = (friends: Friend[]) => {
		const circleStatus = new Map<Status, string>([
			[Status.OFFLINE, "offline"],
			[Status.INGAME, "ingame"],
			[Status.ONLINE, "online"],
		])
	
		const res: JSX.Element[] = friends.map((friend: Friend, i) => {

			return (
				<div key={i} className="friendsTab">
					<button onClick={() => ClientApi.redirect = new URL(PROFILE_ROUTE + '/' + friend.pseudo)}>
						<img className="Avatarbg" src={friend.avatar ? friend.avatar : DefaultImg} />
						{friend.pseudo}
						<div className={`circle ${circleStatus.get(friend.status)}`} />
					</button>
					<ImCross className="rm-friend-svg" onClick={async () => {
						const {friends: newfriends} = await ClientApi.delete(API_USER_DEL_FRIEND + '/' + friend.pseudo)
						setFriends(newfriends)
						setPendings(pendings => pendings.filter(daPending => daPending.pseudo !== friend.pseudo))
					}} />
				</div>
			)
		})
		return res;
	}

	const printPendings = (pendings: Pending[]) => {
	
		const res: JSX.Element[] = pendings.map((pending: Pending, i) => (
			<li className="request-list-elem">
				<div className="request-friend" onClick={() => ClientApi.redirect = new URL(PROFILE_ROUTE + '/' + pending.pseudo)}>
					<img className="Avatarfriend" src={pending.avatar}/>
					<p className="friend-aj">{pending.pseudo}</p>
				</div>
				<div className="choice-friend">
					<button className="aj-button" onClick={async () => {
						const {friends: newfriends} = await ClientApi.post(API_USER_ADD_FRIEND + '/' + pending.pseudo)
						setFriends(newfriends)
						setPendings(pendings => pendings.filter(daPending => daPending.pseudo !== pending.pseudo))
					}} >
						<BsCheck2 className="aj-svg" />
					</button>
					<button className="supp-button" onClick={async () => {
						const {friends: newfriends} = await ClientApi.delete(API_USER_DEL_FRIEND + '/' + pending.pseudo)
						setFriends(newfriends)
						setPendings(pendings => pendings.filter(daPending => daPending.pseudo !== pending.pseudo))
					}} >
						<RxCross1 className="rejet-svg" />
					</button>
				</div>
			</li>
			)
		)
		return (
			<ul className="menu">
				{ res }
			</ul>
		);
	}

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	}






	useEffect(() => {
		(async () => {
			try {
				const data: { friends: Friend[], pendings: Pending[] } =
					await ClientApi.get(API_USER_FRIENDS_LIST)
				console.log("data = ", data)
				const { blockeds }: { blockeds: string[] } = await ClientApi.get(API_USER_BLOCK); 
				data.friends = data.friends.filter(friend => blockeds
					.every(blocked => friend.pseudo !== blocked))
				data.pendings = data.pendings.filter(pending => blockeds
					.every(blocked => pending.pseudo !== blocked))
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
				<h1>Friends</h1>
				{ printFriends(friends) }
			</div>
			{ pendings.length > 0 &&
			<div className={`pending-requests ${isOpen ? '' : 'without_bg'}`}>
				<button className="button_without_style pending" onClick={toggleMenu}>Pending Requests</button>
				{ isOpen &&
				printPendings(pendings)}
			</div> }
		</div>
	)
}

export default Friends