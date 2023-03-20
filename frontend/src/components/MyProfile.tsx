import React, { useEffect } from "react"
import "../styles/PseudoImagesProfile.css"
import "../styles/LevelFriendsProfile.css"
import "../styles/StatsProfile.css"
import "../styles/MatchHistoryProfile.css"
import Navbar from "./Navbar"
import Paysage from "../img/paysage3.jpg"
import { useState } from "react"
import ProgressBar from "./ProgressBar"
import { IUser } from "../interface/IUser"
import Crown from '../img/crown.png'
import ClientApi from "./ClientApi.class"
import { AboutErr, IError, TypeErr } from "../constants/EError"
import { API_BASE_USER } from "../constants/RoutesApi"
import { useParams, useSearchParams } from "react-router-dom"
import { useProfile } from "../hooks/useProfile"
import { Status } from "../constants/EMessage"
import { GameDto } from "../interface/IGame"
import ServerDownPage from "./ServerDownPage"
import { useNotification } from "../hooks/useNotification"
import { useInviteNotification } from "../hooks/useInviteNotification"
import { useSocket } from "../hooks/useSocket"
import { useAvatar } from "../hooks/useAvatar"
import { usePseudo } from "../hooks/usePseudo"

enum Stat {
	WINS,
	LOSES,
	RANK,
}

interface StatMatch {
	user: IUser,
    win: boolean, // on specifie qui win (en cas de deco on peut win en ayant des points inf, en cas des 2 deco, personne ne win)
	score: number,
}

const MyProfile = () => {

	const socket = useSocket()
	const pseudo = usePseudo()
	const avatar = useAvatar()
	const profile = useProfile()
	const notification = useNotification(socket, {pseudo, avatar})
	const inviteNotification = useInviteNotification(socket, pseudo)




	const getProfilImagesAndPseudo = () => (
		<div className="avatar-back-container">
			<img className="backprofil" src={Paysage}/>
			<div className="pseudo-avatar-container">
				<img className="avatarprofil" src={profile?.avatar} alt="avatar"/>
				{ getPseudoAndCo() }
			</div>
		</div>
	)

	const getPseudoAndCo = () => {
		return (
			<div className="pseudo-container">
				<p className="pseudo">{profile?.pseudo}</p>
			</div>
		)
	}

	const getLevel = () => {

		return (
			<div className="level-container">
				<p className="level">Level {profile?.level}</p>
				<ProgressBar bgcolor="blue" completed={profile?.percentageXp} />
			</div>
		)
	}

	const getFriends = () => (
		<div className="friends-container">
			<p className="friends-title">Friends</p>
			<p className="friends-number">{profile?.friends}</p>
		</div>
	)

	const getFriendsAndLevel = () => (
		<div className="level_friends-container">
			{ getLevel() }
			{ getFriends() }
		</div>
	)

	const getSomeStat = (stat: Stat) => {
		const mapStatTitle = new Map<Stat, string>();
		const mapStatNb = new Map<Stat, number | undefined>();

		mapStatTitle.set(Stat.WINS, "Wins")
		mapStatTitle.set(Stat.LOSES, "Loses")
		mapStatNb.set(Stat.WINS, profile?.wins)
		mapStatNb.set(Stat.LOSES, profile?.looses)
		const baseClassName = "stat-item"
		return (
			<div className={baseClassName + "-container"}>
				<p className={baseClassName}>{mapStatTitle.get(stat)}</p>
				<p className={"nb" + baseClassName}>{mapStatNb.get(stat)}</p>
			</div>
		)
	}

	const getStat = () => {

		return (
			<div className="stats-title-container">
				<h3 className="stats-title">Stats</h3>
				<div className="stats-container">
					{ getSomeStat(Stat.WINS) }
					{ getSomeStat(Stat.LOSES) }
				</div>
			</div>
		)
	}

	const getMatches = () => {
		const matchesJSX =  profile?.history.map((match: GameDto, index: number) => {
			return (
				<div key={index} className="match-mode-container">
					<div className="match-container">
						<div className="match-item match-user">
							{match.score1 > match.score2 && <img className="crown" src={Crown} />}
							<p className="match-username match-username1">{match.player1.pseudo}</p>
						</div>
						<p className="match-item match-score match-score1">{match.score1}</p>
						<p className="match-item hyphen">-</p>
						<p className="match-item match-score match-score1">{match.score2}</p>				
						<div className="match-item match-user">
							<p className="match-username match-username2">{match.player2.pseudo}</p>
							{match.score2 > match.score1 && <img className="crown" src={Crown} />}
						</div>
					</div>
					<div className="match-mode">
						<p className="mode">{match.difficulty}</p>
					</div>
				</div>
			)
		})

		return (
			<React.Fragment>
				{
					profile?.history && (
						profile.history.length == 0 && <p>This user haven't faced anyone yet...</p> ||
						profile.history.length > 0 && matchesJSX
					)
				}
			</React.Fragment>
		)
	}

	const getMatchHistory = () => {

		return (
			<div className="match-history-container">
				<h3 className="match-history-title">Match History</h3>
				<div className="match-history">
					{ getMatches() }
				</div>
			</div>
		)
	}




	const getPage = () => (
		<div className="container">
			{ getProfilImagesAndPseudo() }
			{ getFriendsAndLevel() }
			{ getStat() }
			{ getMatchHistory() }
		</div>
	)




	return (
		<React.Fragment>
			<Navbar />
			{
				(
					notification &&
					inviteNotification && (
						profile !== undefined && getPage() ||
						profile === undefined && <ServerDownPage />
					)
				)

			}
		</React.Fragment>
	);
}

export default MyProfile;