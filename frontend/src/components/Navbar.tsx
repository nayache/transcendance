import React, { useEffect } from 'react';
import '../styles/Navbar.styles.css'
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
			name: "Profil",
			href: '/profil',
		},
		{
			name: "Friends",
			href: '/friends',
		},
		{
			name: "Settings",
			href: '/settings',
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
		<div className='navbar_logo'>
			<img src={Logo} alt="Logo"/>
		</div>
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