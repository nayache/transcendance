import React, { useEffect } from "react"
import "../styles/Profile.css"
import "../styles/PseudoImagesProfile.css"
import "../styles/LevelFriendsProfile.css"
import "../styles/StatsProfile.css"
import "../styles/MatchHistoryProfile.css"
import Avatar from "../img/avatar2.jpeg"
import Navbar from "./Navbar"
import Paysage from "../img/paysage3.jpg"
import { useState } from "react"
import ProgressBar from "./ProgressBar"
import { IUser } from "../interface/User"
import Crown from '../img/crown.png'
import ClientApi from "./ClientApi.class"
import { AboutErr, IError, TypeErr } from "../constants/error_constants"
import { API_BASE_USER } from "../constants/RoutesApi"
import { useParams, useSearchParams } from "react-router-dom"

enum Stat {
	WINS,
	LOSES,
	RANK,
}

enum GameMode {
	CLASSIC,
	MEDIUM,
	HARD,
}

interface StatMatch {
	user: IUser,
    win: boolean, // on specifie qui win (en cas de deco on peut win en ayant des points inf, en cas des 2 deco, personne ne win)
	score: number,
}

interface Match {
	userStat: StatMatch,
	opponentStat: StatMatch,
	gameMode: GameMode,
}


const Profile = () => {
	const [isOkay, setIsOkay] = useState<boolean | undefined>()
	const [user, setUser] = useState<IUser>()
	const [pseudo, setPseudo] = useState(useParams().pseudo)
	const [nbFriends, setNbFriends] = useState<number>(3);
	const [nbWins, setNbWins] = useState<number>(3);
	const [nbLoses, setLoses] = useState<number>(2);
	const [rank, setRank] = useState<number>(12);
	const [level, setLevel] = useState<number>(6);
	const [status, setStatus] = useState<string>("En ligne");
	const matches: Match[] = [ // certains trucs comme match history doivent etre visible seulement si on est log
		{
			userStat: {
				user: { pseudo },
				win: true,
				score: 20,
			},
			opponentStat: {
				user: { pseudo: "Guillaumedu77" },
				win: false,
				score: 0,
			},
			gameMode: GameMode.MEDIUM,
		},
		{
			userStat: {
				user: { pseudo },
				win: true,
				score: 2,
			},
			opponentStat: {
				user: { pseudo: "Leodu69" },
				win: false, // il a deco
				score: 7,
			},
			gameMode: GameMode.HARD,
		},
		{
			userStat: {
				user: { pseudo },
				win: false,
				score: 10,
			},
			opponentStat: {
				user: { pseudo: "Manondu62" },
				win: true,
				score: 20,
			},
			gameMode: GameMode.CLASSIC,
		},
		{
			userStat: {
				user: { pseudo },
				win: false,
				score: 15,
			},
			opponentStat: {
				user: { pseudo: "AlanTiaCaptéesrgvsregvvbdfvbdfgbsretgrsgbsrgbsfgbfgsbsfbgb" },
				win: true,
				score: 0,
			},
			gameMode: GameMode.MEDIUM,
		},
	]


	useEffect(() => {
		(async () => {
			try {
				console.log("ytrfygjvhbk")
				console.log("pseudo = ", pseudo);
				const url: string = API_BASE_USER + "/" + pseudo
				const data = await ClientApi.get(url)
				
				setUser(data.user)
				// if (!user)
				// 	throw {
				// 		about: AboutErr.USER,
				// 		type: TypeErr.EMPTY,
				// 	} as IError
				setIsOkay(true)
			} catch (err) {
				setIsOkay(false)
				console.log("err = ", err)
			}
		})()
	}, [])


	const getProfilImagesAndPseudo = () => (
		<div className="avatar-back-container">
			<img className="backprofil" src={Paysage}/>
			<div className="pseudo-avatar-container">
				<img className="avatarprofil" src={Avatar} alt="avatar"/>
				{ getPseudoAndCo() }
			</div>
		</div>
	)

	const getPseudoAndCo = () => {
		const mapStatus = new Map<string, string>()

		mapStatus.set("En ligne", "online");
		mapStatus.set("Hors ligne", "offline");
		mapStatus.set("En pleine partie", "ingame");

		return (
			<div className="pseudo-container">
				<div className={"moncercle " + mapStatus.get(status) } />
				<p className="pseudo">{pseudo}</p>
			</div>
		)
	}

	const getLevel = () => {

		return (
			<div className="level-container">
				<p className="level">Level {level}</p>
				<ProgressBar bgcolor="blue" completed={40} />
			</div>
		)
	}

	const getFriends = () => (
		<div className="friends-container">
			<p className="friends-title">Friends</p>
			<p className="friends-number">{nbFriends}</p>
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
		const mapStatNb = new Map<Stat, number>();

		mapStatTitle.set(Stat.WINS, "Wins")
		mapStatTitle.set(Stat.LOSES, "Loses")
		mapStatTitle.set(Stat.RANK, "Rank")
		mapStatNb.set(Stat.WINS, nbWins)
		mapStatNb.set(Stat.LOSES, nbLoses)
		mapStatNb.set(Stat.RANK, rank)
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
					{ getSomeStat(Stat.RANK) }
				</div>
			</div>
		)
	}

	const getMatches = () => {
		const mode = new Map<GameMode, string>()

		mode.set(GameMode.CLASSIC, "Classic");
		mode.set(GameMode.MEDIUM, "Medium");
		mode.set(GameMode.HARD, "Hard");
		const matchesJSX =  matches.map((match: Match, index: number) => {
			return (
				<div key={index} className="match-mode-container">
					<div className="match-container">
						<div className="match-item match-user">
							{match.userStat.win && <img className="crown" src={Crown} />}
							<p className="match-username match-username1">{match.userStat.user.pseudo}</p>
						</div>
						<p className="match-item match-score match-score1">{match.userStat.score}</p>
						<p className="match-item hyphen">-</p>
						<p className="match-item match-score match-score1">{match.opponentStat.score}</p>				
						<div className="match-item match-user">
							<p className="match-username match-username2">{match.opponentStat.user.pseudo}</p>
							{match.opponentStat.win && <img className="crown" src={Crown} />}
						</div>
					</div>
					<div className="match-mode">
						<p className="mode">{mode.get(match.gameMode)}</p>
					</div>
				</div>
			)
		})

		return (
			<React.Fragment>
				{matchesJSX.length == 0 && <p>You haven't faced anyone yet...</p>}
				{matchesJSX.length > 0 && matchesJSX}
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
		<div>
			<Navbar/>
			<div className="container">
				{ getProfilImagesAndPseudo() }
				{ getFriendsAndLevel() }
				{ getStat() }
				{ getMatchHistory() }
			</div>
		</div>
	)

	return (
		<React.Fragment>
			{isOkay && getPage()}
		</React.Fragment>
	);
}

export default Profile;