import React, { useEffect, useRef } from "react"
import '../styles/UserPreview.css'
import { ChannelRole, Status } from "../constants/EMessage"
import { BASE_URL, PROFILE_EP } from "../constants/RoutesApi"
import { IChannelUser } from "../interface/IChannelUser"
import ClientApi from "./ClientApi.class"

interface Props {
	chanUser: IChannelUser | undefined,
	player: IChannelUser,
	onClose?: (e?: React.MouseEvent<HTMLSpanElement>) => void,
}

interface ButtonProps {
	content: string,
	action: () => void,
	role?: ChannelRole
}

/* to place juste before the element concerned */
const UserPreview = ({ chanUser, player, onClose }: Props) => {

	const { pseudo: playerName, status, role } = player
	const containerRef = useRef<HTMLDivElement>(null);
	const buttons: ButtonProps[] = [
		{
			content: "See the profile",
			action: () => {
				ClientApi.redirect = new URL(BASE_URL + '/profile/' + playerName)
			}
		},
		{
			content: "Invite",
			action: () => {

			},
			role: ChannelRole.USER,
		},
		{
			content: "Add to friends",
			action: () => {

			},
			role: ChannelRole.USER,
		},
		{
			content: "Send message",
			action: () => {

			},
			role: ChannelRole.USER,
		},
		{
			content: "Block",
			action: () => {

			},
			role: ChannelRole.USER,
		},
		{
			content: "Name admin",
			action: () => {

			},
			role: ChannelRole.ADMIN,
		},
		{
			content: "Mute",
			action: () => {

			},
			role: ChannelRole.ADMIN,
		},
		{
			content: "Ban",
			action: () => {

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
			(chanUser.pseudo !== playerName && (_role === undefined || chanUser.role >= _role))
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
		</div>
	)
}

export default UserPreview