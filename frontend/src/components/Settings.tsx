import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {

	const options= [
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
					]
				},
				{
					name: "Two-factor Authentication",
					description: 
						"Enable to give your Truly Expenses account an extra layer of security.",
					tags: [],
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
				},
				
			]
		},
		{
			header: {
				name: "Confidentiality",
			},
			values: [
				{
					name: "Blocked account",
					description: 
						"Accounts you have blocked",
					tags: [],
				},
			]
		}
	]
	const [visibleOptions, setVisibleOptions] = useState(options);


	const handleonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		
		const value= e.target.value;

		if (value.trim().length == 0) {
			setVisibleOptions(options);
			return ;
		}
		const returnedItems: any[] = [];
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
			<div className="settings-container">
				<h1>
					<span className="name-settings">
						Settings
					</span>
				</h1>
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
										<button className="button-value">
											<h4 className="value-name">{values.name}</h4>
											<p className="value-description">{values.description}</p>
										</button>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Settings