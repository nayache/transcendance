import React, { useEffect, useRef, useState } from "react"
import '../styles/UserPreview.css'
import { ChannelRole, Status } from "../constants/EMessage"
import { API_CHAT_CHANNEL_BAN_ROUTE, API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_MUTE_ROUTE, API_USER_ADD_FRIEND, API_USER_BLOCK, API_USER_DEL_FRIEND, API_USER_FRIEND_RELATION, BASE_URL, MESSAGES_EP, PROFILE_EP } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import ClientApi from "./ClientApi.class"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"
import { AlertType } from "./ChatPage"
import { Relation } from "../interface/IUser"
import { delay } from "../functions/Debug_utils"

interface Props {
	chanUser: IChannelUser | undefined,
	player: IChannelUser,
	channel: IChannel,
	onClose?: () => void,
	callback?: (props?: any) => void,
	callbackFail?: (props?: any) => void,
}


type UserRelation = { relation: Relation, blocked: boolean }

const getUserRelation = async (target: IChannelUser): Promise<UserRelation | null> => {
	try {
		// si erreur on cherche pas a comprendre et on renvoie false
		const ret = await ClientApi.get(API_USER_FRIEND_RELATION + '/' + target.pseudo)
		return ret
	} catch (err) {
		return null
	}
}

const userSitutation = {
	isSelf: (chanUser: IChannelUser, target: IChannelUser): boolean => {
		return (chanUser.pseudo === target.pseudo)
	},
	friend: (relation: UserRelation) => {
		return relation.relation
	},
	isBlocked: (relation: UserRelation) => {
		return (relation.blocked)
	},
	canNameAdmin: (chanUser: IChannelUser, target: IChannelUser) => {
		return (
			(chanUser.role === ChannelRole.OWNER ||
				chanUser.role === ChannelRole.ADMIN &&
				target.role === ChannelRole.USER) &&
				target.role === ChannelRole.USER
		)
	},
	canMute: (chanUser: IChannelUser, target: IChannelUser) => {
		return (
			(chanUser.role === ChannelRole.OWNER ||
				chanUser.role === ChannelRole.ADMIN &&
				target.role === ChannelRole.USER) &&
				target.role !== ChannelRole.OWNER
		)
	},
	canKick: (chanUser: IChannelUser, target: IChannelUser) => {
		return (
			(chanUser.role === ChannelRole.OWNER ||
				chanUser.role === ChannelRole.ADMIN &&
				target.role === ChannelRole.USER) &&
				target.role !== ChannelRole.OWNER
		)
	},
	canBan: (chanUser: IChannelUser, target: IChannelUser) => {
		return (
			(chanUser.role === ChannelRole.OWNER ||
				chanUser.role === ChannelRole.ADMIN &&
				target.role === ChannelRole.USER) &&
				target.role !== ChannelRole.OWNER
		)
	},
}

interface ButtonProps {
	content: string,
	action: () => void,
	role: ChannelRole | undefined,
	canPrint: boolean
}

/* to place juste before the element concerned */
const UserPreview = ({ chanUser, player, channel, onClose, callback, callbackFail }: Props) => {

	const { pseudo: playerName, status, role } = player
	const [actionModal, setActionModal] = useState<ModalChannelType | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [buttons, setButtons] = useState<ButtonProps[]>([]);
	const clicked = useRef<boolean>(false);







	const printOtherFromRole = (chanUser: IChannelUser, playerName: string, role: ChannelRole): JSX.Element[] => {
		const classes = new Map<ChannelRole | undefined, string>([
			[undefined, "self_buttons_channel"],
			[ChannelRole.USER, "user_buttons_channel"],
			[ChannelRole.ADMIN, "admin_buttons_channel"],
			[ChannelRole.OWNER, "owner_buttons_channel"],
		]);
		const newButtons = buttons.filter((button: ButtonProps) => button.canPrint)

		return (
			newButtons.map(({content, action, role}: ButtonProps, index: number, array) => {
				console.log("index + 1 < array.length = ", index + 1 < array.length);
				if (index + 1 < array.length && role !== array[index + 1].role)
					return (
						<React.Fragment key={index}>
							<div className="sep-element-container">
								<button onClick={action} className={"preview-button " + classes.get(role) + " button_without_style"}>{content}</button>
							</div>
						</React.Fragment>
					)
				else
					return (
						<div key={index}>
							<button onClick={action} className={"preview-button " + classes.get(role) + " button_without_style"}>{content}</button>
						</div>
					)
			})
		)
	}




	useEffect(() => {
		(async () => {
			try {
				const relation = await getUserRelation(player)

				setButtons([
					{
						content: "See the profile",
						action: () => {
							if (!clicked.current) {
								clicked.current = true
								ClientApi.redirect = new URL(BASE_URL + PROFILE_EP + '/' + playerName)
								if (callback)
									callback(playerName)
							}
						},
						role: undefined,
						canPrint: true,
					},
					{
						content: "Invite",
						action: () => {
							if (!clicked.current) {
								clicked.current = true
								if (callback)
									callback(playerName)
							}
						},
						role: ChannelRole.USER,
						canPrint: (chanUser !== undefined && relation !== null &&
							!userSitutation.isSelf(chanUser, player) && !userSitutation.isBlocked(relation)),
					},
					{
						content: "Add to friends",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								try {
									await ClientApi.post(API_USER_ADD_FRIEND + '/' + playerName,
									JSON.stringify({
										pseudo: playerName
									}), 'application/json')
									if (callback)
										callback(playerName)
								} catch (err) {
									console.log("err = ", err)
									if (callbackFail)
										callbackFail(playerName)
								}
							}
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null &&
							!userSitutation.isBlocked(relation) && userSitutation.friend(relation) === Relation.UNKNOWN),
					},
					{
						content: "Cancel friend request",
						action: async () => {
							try {
								await ClientApi.delete(API_USER_DEL_FRIEND + '/' + playerName)
								if (callback)
									callback(playerName)
							} catch (err) {
								console.log("err = ", err)
								if (callbackFail)
									callbackFail(playerName)
							}
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null &&
							!userSitutation.isBlocked(relation) && userSitutation.friend(relation) === Relation.PENDING),
					},
					{
						content: "Delete friend",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								await ClientApi.delete(API_USER_DEL_FRIEND + '/' + playerName)
								if (callback)
									callback(playerName)
							}
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null &&
							!userSitutation.isBlocked(relation) && userSitutation.friend(relation) === Relation.FRIEND),
					},
					{
						content: "Send message",
						action: () => {
							if (!clicked.current) {
								clicked.current = true
								ClientApi.redirect = new URL(BASE_URL + MESSAGES_EP + '/' + playerName)
								if (callback)
									callback(playerName)
							}
						},
						role: ChannelRole.USER,
						canPrint: (chanUser !== undefined && relation !== null &&
							!userSitutation.isBlocked(relation) && !userSitutation.isSelf(chanUser, player)),
					},
					{
						content: "Block",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								await ClientApi.post(API_USER_BLOCK + '/' + playerName)
								if (callback)
									callback(playerName)
							}
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null && !userSitutation.isBlocked(relation)),
					},
					{
						content: "Unblock",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								await ClientApi.delete(API_USER_BLOCK + '/' + playerName)
								if (callback)
									callback(playerName)
							}
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null && userSitutation.isBlocked(relation)),
					},
					{
						content: "Name admin",
						action: () => {
							if (!clicked.current) {
								clicked.current = true
								setActionModal(ModalChannelType.SETADMIN)
							}
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canNameAdmin(chanUser, player)),
					},
					{
						content: "Mute",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								setActionModal(ModalChannelType.MUTEUSER)
							}
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canMute(chanUser, player)),
					},
					{
						content: "Kick",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								setActionModal(ModalChannelType.KICKUSER)
							}
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canKick(chanUser, player)),
					},
					{
						content: "Ban",
						action: async () => {
							if (!clicked.current) {
								clicked.current = true
								setActionModal(ModalChannelType.BANUSER)
							}
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canBan(chanUser, player)),
					
					},
				])
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [])




	return (
		<div ref={containerRef} className="userPreview-container">
			<div className="userPreview_with_close">
				<div className="userPreview_without_close">
					<p className="pseudo">{playerName}</p>
					{
						chanUser && printOtherFromRole(chanUser, playerName, role)
					}
				</div>
				<span onClick={onClose} className="close-preview">&times;</span>
			</div>
			{actionModal && <ModalChannelMenu active={actionModal ? true : false} type={actionModal}
			pointedChannelName={channel.name} target={player} callback={() => {
				setActionModal(null)
				if (callback)
					callback()
			}}
			callbackFail={() => {
				setActionModal(null)
				if (callbackFail)
					callbackFail()
			}} />
			}
		</div>
	)
}

export default UserPreview