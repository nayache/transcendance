import React, { useEffect, useRef, useState } from "react"
import '../styles/UserPreview.css'
import { ChannelRole, Status } from "../constants/EMessage"
import { API_CHAT_CHANNEL_BAN_ROUTE, API_CHAT_CHANNEL_KICK_ROUTE, API_CHAT_CHANNEL_MUTE_ROUTE, BASE_URL, PROFILE_EP } from "../constants/RoutesApi"
import { IChannel, IChannelUser } from "../interface/IChannel"
import ClientApi from "./ClientApi.class"
import ModalChannelMenu, { ModalChannelType } from "./ModalChannelMenu"
import { AlertType } from "./ChatPage"

interface Props {
	chanUser: IChannelUser | undefined,
	player: IChannelUser,
	channel: IChannel,
	onMute?: (mutedPseudo: string) => void,
	onKick?: (kickedPseudo: string) => void,
	onBan?: (bannedPseudo: string) => void,
	onClose?: (e?: React.MouseEvent<HTMLSpanElement>) => void,
}

// const UserSitutation = {
// 	self: (chanUser: IChannelUser, target: IChannelUser): boolean => {
// 		return (chanUser.pseudo === target.pseudo)
// 	},
// 	friend: async (chanUser: IChannelUser, target: IChannelUser): Promise<boolean> => {
// 		try {
// 			// si erreur on cherche pas a comprendre et on renvoie false
// 			await ClientApi.get()
// 				return (chanUser.pseudo === target.pseudo)
// 		} catch (err) {
// 			return false
// 		}
// 	},
// 	blocked: async (): Promise<boolean> => {
// 		try {
// 			// si erreur on cherche pas a comprendre et on renvoie false
// 			await ClientApi.get()
// 				return (chanUser.pseudo === target.pseudo)
// 		} catch (err) {
// 			return false
// 		}
// 	},
// 	blocked: async (): Promise<boolean> => {
// 		try {
// 			// si erreur on cherche pas a comprendre et on renvoie false
// 			await ClientApi.get()
// 				return (chanUser.pseudo === target.pseudo)
// 		} catch (err) {
// 			return false
// 		}
// 	},
// 	role: async (): Promise<boolean> => {
// 		try {
// 			// si erreur on cherche pas a comprendre et on renvoie false
// 			await ClientApi.get()
// 				return (chanUser.pseudo === target.pseudo)
// 		} catch (err) {
// 			return false
// 		}
// 	},
// }

interface ButtonProps {
	content: string,
	action: () => void,
	role: ChannelRole,
}

/* to place juste before the element concerned */
const UserPreview = ({ chanUser, player, channel, onMute, onBan, onKick, onClose }: Props) => {

	const { pseudo: playerName, status, role } = player
	const [actionModal, setActionModal] = useState<ModalChannelType | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const buttons: ButtonProps[] = [
		{
			content: "See the profile",
			action: () => {
				ClientApi.redirect = new URL(BASE_URL + '/profile/' + playerName)
			},
			role: ChannelRole.USER,
			// omit: [],
		},
		{
			content: "Invite",
			action: () => {

			},
			role: ChannelRole.USER,
			// omit: [UserSitutation.SELF],
		},
		{
			content: "Add to friends",
			action: () => {
				
			},
			role: ChannelRole.USER,
			// omit: [UserSitutation.SELF, UserSitutation.FRIEND],
		},
		{
			content: "Send message",
			action: () => {

			},
			role: ChannelRole.USER,
			// omit: [UserSitutation.SELF],
		},
		{
			content: "Block",
			action: () => {

			},
			role: ChannelRole.USER,
			// omit: [UserSitutation.SELF, UserSitutation.BLOCKED],
		},
		{
			content: "Name admin",
			action: () => {
				setActionModal(ModalChannelType.SETADMIN)
			},
			role: ChannelRole.ADMIN,
			// omit: [UserSitutation.SELF, UserSitutation.ADMIN, UserSitutation.OWNER],
		},
		{
			content: "Mute",
			action: async () => {
				setActionModal(ModalChannelType.MUTEUSER)
			},
			role: ChannelRole.ADMIN,
			// omit: [UserSitutation.SELF, UserSitutation.MUTED, UserSitutation.OWNER],
		},
		{
			content: "Kick",
			action: async () => {
				setActionModal(ModalChannelType.KICKUSER)
			},
			role: ChannelRole.ADMIN,
		},
		{
			content: "Ban",
			action: async () => {
				setActionModal(ModalChannelType.BANUSER)
			},
			role: ChannelRole.ADMIN,
		},
	]





	const printOtherFromRole = (chanUser: IChannelUser, playerName: string, role: ChannelRole): JSX.Element[] => {
		const classes = new Map<ChannelRole | undefined, string>([
			[undefined, "self_buttons_channel"],
			[ChannelRole.USER, "user_buttons_channel"],
			[ChannelRole.ADMIN, "admin_buttons_channel"],
			[ChannelRole.OWNER, "owner_buttons_channel"],
		]);
		const newButtons = buttons.filter(({role: _role}: ButtonProps) => (
			(chanUser.pseudo === playerName && _role === undefined) ||
			(chanUser.pseudo !== playerName &&
				(_role === undefined || (chanUser.role >= _role)))
		))

		return (
			newButtons.map(({content, action, role}: ButtonProps, index: number, array) => {
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