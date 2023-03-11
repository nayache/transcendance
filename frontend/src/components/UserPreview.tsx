import React, { useEffect, useRef, useState } from "react"
import '../styles/UserPreview.css'
import { ChannelRole, Status } from "../constants/EMessage"
import { API_CHAT_CHANNEL_BAN_ROUTE, API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_MUTE_ROUTE, API_USER_FRIEND_RELATION, BASE_URL, PROFILE_EP } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import ClientApi from "./ClientApi.class"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"
import { AlertType } from "./ChatPage"
import { Relation } from "../interface/IUser"

interface Props {
	chanUser: IChannelUser | undefined,
	player: IChannelUser,
	channel: IChannel,
	onMute?: (mutedPseudo: string) => void,
	onKick?: (kickedPseudo: string) => void,
	onBan?: (bannedPseudo: string) => void,
	onClose?: (e?: React.MouseEvent<HTMLSpanElement>) => void,
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
	isFriend: (relation: UserRelation) => {
		return (relation.relation === Relation.FRIEND)
	},
	isBlocked: (relation: UserRelation) => {
		return (relation.blocked)
	},
	canNameAdmin: (chanUser: IChannelUser, target: IChannelUser) => {
		return (
			(chanUser.role === ChannelRole.OWNER ||
				chanUser.role === ChannelRole.ADMIN &&
				target.role === ChannelRole.USER) &&
				target.role !== ChannelRole.OWNER
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
const UserPreview = ({ chanUser, player, channel, onMute, onBan, onKick, onClose }: Props) => {

	const { pseudo: playerName, status, role } = player
	const [actionModal, setActionModal] = useState<ModalChannelType | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [buttons, setButtons] = useState<ButtonProps[]>([]);







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
							ClientApi.redirect = new URL(BASE_URL + '/profile/' + playerName)
						},
						role: undefined,
						canPrint: true,
					},
					{
						content: "Invite",
						action: () => {
			
						},
						role: ChannelRole.USER,
						canPrint: (chanUser !== undefined && !userSitutation.isSelf(chanUser, player)),
					},
					{
						content: "Add to friends",
						action: () => {
							
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null && !userSitutation.isFriend(relation)),
					},
					{
						content: "Delete friend",
						action: () => {
							
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null && userSitutation.isFriend(relation)),
					},
					{
						content: "Send message",
						action: () => {
			
						},
						role: ChannelRole.USER,
						canPrint: (chanUser !== undefined && !userSitutation.isSelf(chanUser, player)),
					},
					{
						content: "Block",
						action: () => {
			
						},
						role: ChannelRole.USER,
						canPrint: (relation !== null && !userSitutation.isBlocked(relation)),
					},
					{
						content: "Name admin",
						action: () => {
							setActionModal(ModalChannelType.SETADMIN)
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canNameAdmin(chanUser, player)),
					},
					{
						content: "Mute",
						action: async () => {
							setActionModal(ModalChannelType.MUTEUSER)
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canMute(chanUser, player)),
					},
					{
						content: "Kick",
						action: async () => {
							setActionModal(ModalChannelType.KICKUSER)
						},
						role: ChannelRole.ADMIN,
						canPrint: (chanUser !== undefined && userSitutation.canKick(chanUser, player)),
					},
					{
						content: "Ban",
						action: async () => {
							setActionModal(ModalChannelType.BANUSER)
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
			pointedChannelName={channel.name} target={player} callback={() => setActionModal(null)}
			callbackFail={() => setActionModal(null)} />
			}
		</div>
	)
}

export default UserPreview