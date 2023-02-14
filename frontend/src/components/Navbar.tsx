import React, { useEffect } from 'react';
import '../styles/Navbar.css'
import {useState} from "react"
import Logo from '../img/pong.png'


interface BarItem {
	name: string,
	href: string
}

const Navbar = () => {

	const [showLinks, setShowLinks] = useState(false);
	const barItems: BarItem[] = [
		{
			name: "Profile",
			href: '/me/profile',
		},
		{
			name: "Friends",
			href: '/me/friends',
		},
		{
			name: "Settings",
			href: '/settings',
		},
		{
			name: "Chats",
			href: '/chats',
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