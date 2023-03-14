import Navbar from "./Navbar";
import '../styles/EnableTwoFASettings.css'
import '../styles/MyProfileSettings.css'
import '../styles/Toggle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiTriangle } from "react-icons/fi"
import Modal from "./Modal";
import ClientApi from "./ClientApi.class";
import { API_TWOFA_ROUTE } from "../constants/RoutesApi";
import ImgModal from "./ImgModal";
import { usePseudo } from "../hooks/usePseudo";
import { useAvatar } from "../hooks/useAvatar";

let differenceHeight: number = 0;

const MyProfileSettings = () => {

	const pseudo = usePseudo()
	const avatar = useAvatar()
	const [ imgData, setImgData ] = useState<string>("");






	return (
		<React.Fragment>
			<div className="two-factor-content-container">
				<div className="two-factor-clickable">
					<p className="two-factor-action">Change the pseudo</p>
				</div>
				<div className={"two-factor-content unrolled"}>
					<input placeholder="Enter a new pseudo" className="input-profile-settings" />
				</div>
			</div>
		</React.Fragment>
	)
}

export default MyProfileSettings