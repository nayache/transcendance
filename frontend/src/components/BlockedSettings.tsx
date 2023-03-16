import Navbar from "./Navbar";
import '../styles/EnableTwoFASettings.css'
import '../styles/BlockedSettings.css'
import '../styles/Toggle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import ClientApi from "./ClientApi.class";
import { API_AVATAR_ROUTE, API_BASE_USER, API_PSEUDO_ROUTE, API_TWOFA_ROUTE, API_USER_BLOCK, BASE_URL, PROFILE_EP, PROFILE_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { printButton, BtnStatus } from "./Button"
import { usePseudo } from "../hooks/usePseudo";
import { useAvatar } from "../hooks/useAvatar";

let differenceHeight: number = 0;

const BlockedSettings = () => {

	const pseudo = usePseudo();
	const [blockeds, setBlockeds] = useState<string[]>([])



	const printBlockeds = (blockeds: string[]) => {

		return blockeds.map(blocked => (
			<div className="blocked-account-settings">
				<p onClick={() => ClientApi.redirect = new URL(PROFILE_ROUTE + '/' + blocked)}>{blocked}</p>
				<button className="button_without_style unblock-btn-settings"
				onClick={async () => {
					const data: { blockeds: string[] } = await ClientApi.delete(API_USER_BLOCK + '/' + blocked)
					setBlockeds(data.blockeds)
				}}>Unblock</button>
			</div>
		))
	}




	useEffect(() => {
		(async () => {
			try {
				const data: { blockeds: string[] } = await ClientApi.get(API_USER_BLOCK)
				setBlockeds(data.blockeds)
			} catch (err) {
				console.log("err = ", err)
			}
		})()
	}, [])




	return (
		<React.Fragment>
			<Navbar />
			<div className="two-factor-content-container">
				<div className="two-factor-clickable">
					<p className="two-factor-action">Blocked accounts</p>
				</div>
				{ printBlockeds(blockeds) }
			</div>
		</React.Fragment>
	)
}

export default BlockedSettings