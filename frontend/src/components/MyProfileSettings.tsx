import Navbar from "./Navbar";
import '../styles/EnableTwoFASettings.css'
import '../styles/MyProfileSettings.css'
import '../styles/Toggle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import ClientApi from "./ClientApi.class";
import { API_AVATAR_ROUTE, API_BASE_USER, API_PSEUDO_ROUTE, API_TWOFA_ROUTE, BASE_URL, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { printButton, BtnStatus } from "./Button"
import DefaultImg from "../img/avatar2.jpeg"
import { usePseudo } from "../hooks/usePseudo";
import { useAvatar } from "../hooks/useAvatar";
import { useSocket } from "../hooks/useSocket";
import { useNotification } from "../hooks/useNotification";
import { useInviteNotification } from "../hooks/useInviteNotification";

let differenceHeight: number = 0;

const MyProfileSettings = () => {

	const pseudo = usePseudo();
	const avatar = useAvatar();
	const pseudoWritten = useRef<string>('');
	const [newAvatar, setNewAvatar] = useState<string | undefined>(undefined)
	const [pseudoErrorText, setPseudoErrorText] = useState<string>("")
	const [avatarErrorText, setAvatarErrorText] = useState<string>("")
	const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined)
	const [servorErrorText, setServorErrorText] = useState<string>("");
	const [isOkay, setIsOkay] = useState<boolean | undefined>();
	const [btnPseudoStatus, setBtnPseudoStatus] = useState<BtnStatus>("idle")
	const [btnAvatarStatus, setBtnAvatarStatus] = useState<BtnStatus>("idle")
	const socket = useSocket()
	const notification = useNotification(socket, {pseudo, avatar})
	const inviteNotification = useInviteNotification(socket, pseudo)






	const handlePseudoSubmit = async () => {
		setPseudoErrorText("")
		setServorErrorText("")
		try {
			if (pseudoWritten.current) {
				setBtnPseudoStatus("loading")
				await ClientApi.patch(API_PSEUDO_ROUTE, JSON.stringify({
					pseudo: pseudoWritten.current
				}), 'application/json')
				setBtnPseudoStatus("good")
			}
		} catch (err) {
			const _error: IError = err as IError
			console.log("_error.about = ", _error.about)
			console.log("_error = ", _error);
			if (err == "Not Found")
				setServorErrorText("Failed to fetch to the server")
			else {
				if (_error.about == AboutErr.PSEUDO) {
					if (_error.type == TypeErr.EMPTY)
						setPseudoErrorText("Don't leave an empty pseudo")
					else if (_error.type == TypeErr.INVALID)
						setPseudoErrorText("Please choose a valid pseudo. Size: 3 - 20 characters")
					else if (_error.type == TypeErr.DUPLICATED)
					setPseudoErrorText("The pseudo already exists. Please provide another pseudo")
				}
			}
			setBtnPseudoStatus("fail")
		}
		setTimeout(() => setBtnPseudoStatus("idle"), 2000)
		setTimeout(() => {
			setPseudoErrorText("")
			setAvatarErrorText("")
			setServorErrorText("")
		}, 10000)
	}

	const handleAvatarSubmit = async () => {
		setAvatarErrorText("")
		setServorErrorText("")
		try {
			const formData = new FormData()
			if (avatarFile) {
				setBtnAvatarStatus("loading")
				formData.append("file", avatarFile, avatarFile.name)
				const data = await ClientApi.patch(API_AVATAR_ROUTE, formData)
				setBtnAvatarStatus("good")
			}
			else {
				setBtnAvatarStatus("loading")
				const data = await ClientApi.delete(API_AVATAR_ROUTE)
				setBtnAvatarStatus("good")
			}
		} catch (err) {
			const _error: IError = err as IError
			const _err: {statusCode: string | number} = err as {statusCode: string | number}

			console.log("_error.about = ", _error.about)
			console.log("_error = ", _error);
			if (err == "Not Found")
				setServorErrorText("Failed to fetch to the server")
			else {
				if (_error.about == AboutErr.AVATAR) {
					if (_error.type == TypeErr.INVALID)
						setAvatarErrorText("Please choose a image file (.png, .jpg)")
					else if (_error.type == TypeErr.DUPLICATED)
						setAvatarErrorText("Please provide a unique avatar filename among all avatar filenames already provided")
				}
				else {
					if (_err.statusCode == 413)
						setAvatarErrorText("Please choose a lighter image file")
				}
			}
			setBtnAvatarStatus("fail")
		}
		setTimeout(() => setBtnAvatarStatus("idle"), 2000)
		setTimeout(() => {
			setPseudoErrorText("")
			setAvatarErrorText("")
			setServorErrorText("")
		}, 10000)
	}

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		pseudoWritten.current = event.target.value;
	}

	const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files)
		{
			console.log("event.target.fiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiles[0] = ", event.target.files[0]);
			setNewAvatar(URL.createObjectURL(event.target.files[0]));
			setAvatarFile(event.target.files[0])
			// const file = ClientApi.resizeFile(event.target.files[0]) as Promise<File>
			// setAvatarFile(await file);
		}
	}




	useEffect(() => {
		setNewAvatar(avatar)
	}, [avatar])





	return (
		<React.Fragment>
			<Navbar />
			{ notification }
			{ inviteNotification }
			<div className="two-factor-content-container">
				<div className="two-factor-clickable">
					<p className="two-factor-action">Edit your profile</p>
				</div>
				<div className={"two-factor-content unrolled"}>
					<label>New pseudo :</label>
					<input placeholder="Enter a new pseudo" defaultValue={pseudo}
					onChange={(e) => handleChangeName(e)} className="input-profile-settings" />
				</div>
				{ printButton({
					status: btnPseudoStatus,
					content: "Save",
					className: "button_without_style btnSave-settings",
					onClick: () => {
						handlePseudoSubmit()
					}
				}) }
				{pseudoErrorText && <p className='error-text'>{pseudoErrorText}</p>}
				<br />
				<div className={"two-factor-content img-container-settings unrolled"}>
					<label>New avatar :</label>
					<div className="img-btn-container">
						<label htmlFor="fileChange">
							<input type="file" accept="image/png, image/jpeg" id="fileChange" hidden 
							onChange={(e) => handleChangeAvatar(e)}/>
							<img src={newAvatar} alt="Avatar"/>
						</label>
						<button className="button-24 delete-btn" onClick={() => {
							setNewAvatar(DefaultImg);
							setAvatarFile(undefined)
						}}>Delete</button>
					</div>
				</div>
				{ printButton({
					status: btnAvatarStatus,
					content: "Save",
					className: "button_without_style btnSave-settings",
					onClick: () => {
						handleAvatarSubmit()
					}
				}) }
				{avatarErrorText && <p className='error-text'>{avatarErrorText}</p>}
			</div>
			{servorErrorText && <p className='error-text'>{servorErrorText}</p>}
		</React.Fragment>
	)
}

export default MyProfileSettings