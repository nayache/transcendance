import React, { useEffect } from 'react';
import '../styles/Navbar.css'
import { useState } from "react"
import Logo from '../img/pong.png'
import { CHAT_EP, MESSAGES_EP, MYFRIENDS_EP, MYPROFILE_EP, SETTINGS_EP } from '../constants/RoutesApi';


interface BarItem {
	name: string,
	href: string
}

const Navbar = () => {

	const [showLinks, setShowLinks] = useState(false);
	const barItems: BarItem[] = [
		{
			name: "Profile",
			href: MYPROFILE_EP,
		},
		{
			name: "Friends",
			href: MYFRIENDS_EP,
		},
		{
			name: "Messages",
			href: MESSAGES_EP
		},
		{
			name: "Chat",
			href: CHAT_EP,
		},
		{
			name: "Settings",
			href: SETTINGS_EP,
		},
	]


	const handleShowLinks = () => {
		setShowLinks(!showLinks)
	}

	const printBarItems = () => {
		const res: JSX.Element[] = barItems.map((barItem: BarItem, index: number) => {
			return (
				<li key={index} className={'navbar_item slideInDown-' + (index + 1)}>
					<a href={barItem.href} className='navbar_link'>{barItem.name}</a>
				</li>
			)
		})
		return res;
	}


	return (
		<nav className={`navbar ${showLinks ? "show-nav" : "hide-nav"}`}>
		<a className='navbar_logo' href='/'>
			<img src={Logo} alt="Logo"/>
		</a>
		<ul className='navbar_links'>
			{ printBarItems() }
		</ul>
		<button className='navbar_burger' onClick={handleShowLinks}>
			<span className='burger-bar'></span>
		</button>
		</nav>
  	)
}

export default Navbar;