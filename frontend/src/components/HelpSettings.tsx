import Navbar from "./Navbar";
import '../styles/EnableTwoFASettings.css'
import '../styles/HelpSettings.css'
import '../styles/Toggle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import ClientApi from "./ClientApi.class";
import { API_AVATAR_ROUTE, API_BASE_USER, API_PSEUDO_ROUTE, API_TWOFA_ROUTE, BASE_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { printButton, BtnStatus } from "./Button"
import { usePseudo } from "../hooks/usePseudo";
import { useAvatar } from "../hooks/useAvatar";

let differenceHeight: number = 0;

const HelpSettings = () => {

	const pseudo = usePseudo();



	return (
		<React.Fragment>
			<Navbar />
			<div className="two-factor-content-container">
				<h3>Help</h3>
				<p>If you need help, you need to find help. Y'all already know who it is.. It's ya boi Fryzie on the mic</p>
				<p>You can find help where it is. To find this help, just go search for it and you will find it pretty easily,
					nothing is guaranteed but I can tell in my case that was pretty fast so right now you can do whatever you want</p>
			</div>
		</React.Fragment>
	)
}

export default HelpSettings