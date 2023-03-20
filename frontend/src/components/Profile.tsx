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
import { IUser } from "../interface/IUser"
import Crown from '../img/crown.png'
import ClientApi from "./ClientApi.class"
import { AboutErr, IError, TypeErr } from "../constants/EError"
import { API_BASE_USER, API_USER_ADD_FRIEND, API_USER_DEL_FRIEND, GAMEPAGE_ROUTE, MESSAGES_ROUTE } from "../constants/RoutesApi"
import { useParams, useSearchParams } from "react-router-dom"
import { useProfile } from "../hooks/useProfile"
import { ChannelRole, Status } from "../constants/EMessage"
import { GameDto } from "../interface/IGame"
import ServerDownPage from "./ServerDownPage"
import { useNotification } from "../hooks/useNotification"
import { useInviteNotification } from "../hooks/useInviteNotification"
import { useSocket } from "../hooks/useSocket"
import { useAvatar } from "../hooks/useAvatar"
import { usePseudo } from "../hooks/usePseudo"
import { DisplayAchievements, IDisplayAchievement } from "../constants/Achievements"
import FirstBanner from "../img/first_banner.png"
import MiddleBanner from "../img/middle_banner.png"
import LastBanner from "../img/last_banner.png"
import { AiOutlinePlusSquare } from "react-icons/ai"
import { Relation } from "../interface/IUser"
import { AiOutlineMinusSquare } from "react-icons/ai"
import { FiMessageSquare } from "react-icons/fi"
import { FaGamepad } from "react-icons/fa"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"

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


const Profile = () => {

	const pseudoParam = useParams().pseudo
	const socket = useSocket()
	const pseudo = usePseudo()
	const avatar = useAvatar()
	const [profile, error] = useProfile(pseudoParam !== pseudo ? pseudoParam : undefined)
	const notification = useNotification(socket, {pseudo, avatar})
	const inviteNotification = useInviteNotification(socket, pseudo)
	const [btnFriends, setBtnFriends] = useState<Relation | undefined>(profile?.relation)
	const [actionModal, setActionModal] = useState<ModalChannelType | null>(null)



	useEffect(() => {
		setBtnFriends(profile?.relation)
	}, [profile])

	const getProfilImagesAndPseudo = () => {
		let srcImg: string | undefined;

		if (profile && profile?.level < 3)
			srcImg = FirstBanner
		else if (profile && profile?.level < 7)
			srcImg = MiddleBanner
		else if (profile && profile?.level < 10)
			srcImg = LastBanner
		return (
			<div className="avatar-back-container">
				<img className="backprofil" src={srcImg}/>
				<div className="pseudo-avatar-container">
					<img className="avatarprofil" src={profile?.avatar} alt="avatar"/>
					{ getPseudoAndCo() }
					{
						profile?.relation !== undefined &&
						<div className="interaction-container">
							<div className="sendMsg-profile"
							onClick={() => {
								ClientApi.redirect = new URL(MESSAGES_ROUTE + '/' + profile.pseudo)
							}}>
								<p>Send message</p>
								<FiMessageSquare className="profile-sendMessage-svg" />
							</div>
							<div className="sendMsg-profile"
							onClick={() => {
								setActionModal(ModalChannelType.INVITEUSER)
							}}>
								<p>Invite</p>
								<FaGamepad className="profile-sendMessage-svg" />
							</div>
						</div>
					}
				</div>
			</div>
		)
	}

	const getPseudoAndCo = () => {
		return (
			<div className="pseudo-container">
				<p className="pseudo">{profile?.pseudo}</p>
				{
					profile?.relation !== undefined && (
						
						btnFriends === Relation.UNKNOWN &&
						<div className="addToFriends-container">
							<AiOutlinePlusSquare className="addToFriends-svg"
							onClick={async () => {
								await ClientApi.post(API_USER_ADD_FRIEND + '/' + profile.pseudo)
								setBtnFriends(Relation.PENDING)
							}}/>
						</div>
						||

						btnFriends === Relation.PENDING &&
						<div className="addToFriends-container">
							<p>Pending...</p>
						</div>
						||

						btnFriends === Relation.FRIEND &&
						<div className="addToFriends-container">
							<AiOutlineMinusSquare className="addToFriends-svg" 
							onClick={async () => {
								await ClientApi.delete(API_USER_DEL_FRIEND + '/' + profile.pseudo)
								setBtnFriends(Relation.UNKNOWN)
							}}/>
						</div>
					)
				}
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

	const getSomeAchievement = (key: number, achievement?: IDisplayAchievement) => {
		return (
			<React.Fragment key={key}>
				{
					achievement &&
					<div className="achievement-container">
						<img className="achievement-img" src={achievement.img} />
						<p className="achievement-name">{achievement.name}</p>
					</div>
				}
			</React.Fragment>
		)
	}

	const getStat = () => {

		return (
			<div className="stats-title-container">
				<div>
					<h3 className="stats-title">Stats</h3>
					<div className="stats-container">
						{ getSomeStat(Stat.WINS) }
						{ getSomeStat(Stat.LOSES) }
					</div>
				</div>
				<div>
					<h3 className="stats-title">Achievements</h3>
					<div className="achievements-container">
						{
							profile?.achievements && profile.achievements.map((achievement, key) => (
								<React.Fragment>
									{ getSomeAchievement(key, DisplayAchievements
										.find(displayAchievement => displayAchievement.name === achievement)) }
								</React.Fragment>
							))
						}
					</div>
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
		});




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
				error === undefined && notification &&
				inviteNotification && (
					profile !== undefined && getPage() ||
					profile === undefined && <ServerDownPage />
				) ||

				error !== undefined && error !== null &&
				<div>
					Sorry, the player doesn't exist
				</div>
				
			}
			{ actionModal && profile?.pseudo &&
				<ModalChannelMenu active={actionModal ? true : false} type={actionModal}
				target={{
					pseudo: profile.pseudo,
					role: ChannelRole.USER,
					status: Status.ONLINE,
					color: 'black',
				}} callback={(props) => {
					if (actionModal === ModalChannelType.INVITEUSER)
						ClientApi.redirect = new URL(GAMEPAGE_ROUTE + '/' + props.difficulty + '/fromInvite/' + profile.pseudo)
					setActionModal(null)
				}}
				callbackFail={() => {
					setActionModal(null)
				}} />
			}
		</React.Fragment>
	);
}

export default Profile;