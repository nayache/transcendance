import '../styles/Signin.css'
import AvatarDefault from '../img/avatar2.jpeg'
import React, { useEffect, useState } from "react"
import ClientApi from './ClientApi.class'
import MiddlewareRedirection from './MiddlewareRedirection.class'
import { API_AVATAR_ROUTE, API_BASE_USER, API_PSEUDO_ROUTE } from '../constants/RoutesApi'

const Signin = () => {

	const [pseudo, setPseudo] = useState<string>();
	const [pseudoErrorText, setPseudoErrorText] = useState<string>("")
	const [avatar, setAvatar] = useState<string>(AvatarDefault);
	const [avatarErrorText, setAvatarErrorText] = useState<string>("")
	const [avatarFile, setAvatarFile] = useState<File>()
	const [isOkay, setIsOkay] = useState<boolean>(false);


	useEffect(() => {
		(async () => {
			try {
				setIsOkay(await MiddlewareRedirection.isTokenOkay())
			} catch (err) {
				console.log("err = ", err);
			}
		})()
	}, [])


	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formData = new FormData()
			if (pseudo)
				formData.append('pseudo', pseudo)
			if (avatar && avatarFile)
				formData.append("file", avatarFile, avatarFile.name)
			const data = await ClientApi.post(API_BASE_USER, formData)
			ClientApi.redirect = '/'
		} catch (err) {
			// setPseudoErrorText("Please choose a valid pseudo")
			// setAvatarErrorText("Please choose a good avatar with a new filename")
		}
	}

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPseudo(event.target.value);
	}

	const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files)
		{
			console.log("event.target.fiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiles[0] = ", event.target.files[0]);
			setAvatar(URL.createObjectURL(event.target.files[0]));
			setAvatarFile(event.target.files[0])
			// const file = ClientApi.resizeFile(event.target.files[0]) as Promise<File>
			// setAvatarFile(await file);
		}
	}
	
	const getPage = () => {
		return (
			<div className="signIn">
				<form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data"> 
					<h3>Choose your pseudo</h3>
					<input value={pseudo} type="text" 
					id="input1"
					placeholder="Enter your pseudo..."
					onChange={(e) => handleChangeName(e)}/>
					{pseudoErrorText && <p className='error-text'>{pseudoErrorText}</p>}
					<h3>Choose your avatar</h3>
					<label htmlFor="fileChange">
						<input type="file" accept="image/png, image/jpeg" id="fileChange" hidden 
						onChange={(e) => handleChangeAvatar(e)}/>
						<img src={avatar} alt="Avatar"/>
					</label>
					{avatarErrorText && <p className='error-text'>{avatarErrorText}</p>}
					<br></br>
					<button type="submit">
						LOGIN
					</button>
				</form>
			</div>
		)
	}
	

	return (
		<React.Fragment>
			{isOkay && getPage()}
		</React.Fragment>
	)
}

export default Signin;