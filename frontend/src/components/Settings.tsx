import React from "react";
import '../styles/index.css'
import Navbar from "../components/Navbar";
import { useState } from "react";
import "../styles/Settings.css";
import { BASE_URL, SETTINGS_BLOCKED_EP, SETTINGS_HELP_EP, SETTINGS_MYPROFILE_EP, SETTINGS_TWOFA_EP } from "../constants/RoutesApi";
import ClientApi from "./ClientApi.class";
import { usePseudo } from "../hooks/usePseudo";
import { useNotification } from "../hooks/useNotification";
import { useInviteNotification } from "../hooks/useInviteNotification";
import { useSocket } from "../hooks/useSocket";
import { useAvatar } from "../hooks/useAvatar";

interface IOptionValue {
	name: string;
	description: string;
	tags: string[];
	href: string;
}

interface IOption {
	header: {
		name: string;
	}
	values: IOptionValue[]
}

// changer le theme du site (background devient black lightblack ou bien red lightred, etc..)
const Settings = () => {

	const options: IOption[] = [
		{
			header: {
				name: "Account"
			},
			values: [
				{
					name: "Profile",
					description:
						"Your username is your identity on this app and is used to log in.",
					tags: [
						"username",
						"avatar",
					],
					href: SETTINGS_MYPROFILE_EP,
				},
				{
					name: "Two-factor Authentication",
					description: 
						"Enable to give your Truly Expenses account an extra layer of security.",
					tags: [],
					href: SETTINGS_TWOFA_EP,
				},
			]
		},
		{
			header: {
				name: "Support",
			},
			values: [
				{
					name: "Help",
					description: "Having trouble",
					tags: [],
					href: SETTINGS_HELP_EP
				},
			]
		},
		{
			header: {
				name: "Confidentiality",
			},
			values: [
				{
					name: "Blocked accounts",
					description: 
						"Accounts you have blocked",
					tags: [],
					href: SETTINGS_BLOCKED_EP
				},
			]
		}
	]
	const [visibleOptions, setVisibleOptions] = useState(options);
	const pseudo = usePseudo()
	const avatar = useAvatar()
	const socket = useSocket()
	const notification = useNotification(socket, {pseudo, avatar})
	const inviteNotification = useInviteNotification(socket, pseudo)






	const handleonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		
		const { value } = e.target;
		
		if (value.trim().length == 0) {
			setVisibleOptions(options);
			return ;
		}
		const returnedItems: IOption[] = [];
		options.forEach((options, index) => {
			const foundOptions = options.values.filter((item) => {
				return (item.name.toLocaleLowerCase().search(value.trim().toLowerCase()) !== -1
					|| item.description.toLocaleLowerCase().search(value.trim().toLowerCase()) !== -1)
			})
			returnedItems[index]={
				header:{
					name: options.header.name,
				},
				values: foundOptions,
			}
		})
		setVisibleOptions(returnedItems);
	}





	return (
		<div>
			<Navbar/>
			{ notification }
			{ inviteNotification }
			<div className="settings-container">
				<h2>
					<span className="name-settings">
						Settings
					</span>
				</h2>
				<input type="text" 
				className="form-search" 
				placeholder="Search..."
				onChange={handleonChange} />
				
				<div>
					{ visibleOptions.map((options) => (
						<div className="header-container" key={options.header.name}>
							<h3>{options.header.name}</h3>
							<div>
								{ options.values.map((values) => ( 
									<div className="items-value" key={values.name}>
										<a href={values.href}>
											<button className="button-value">
												<h4 className="value-name">{values.name}</h4>
												<p className="value-description">{values.description}</p>
											</button>
										</a>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="connection">
					<h3>Connection</h3>
					<button onClick={() => {
						ClientApi.disconnect();
						ClientApi.redirect = new URL(BASE_URL)
					}} className="button_without_style"><h4 className="title-connection">Logout</h4></button>
				</div>
			</div>
		</div>
	)
}

export default Settings