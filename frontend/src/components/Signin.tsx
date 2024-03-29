import '../styles/Signin.css'
import AvatarDefault from '../img/avatar2.jpeg'
import React, { useEffect, useState } from "react"
import ClientApi from './ClientApi.class'
import { API_BASE_USER, API_PSEUDO_ROUTE, BASE_URL } from '../constants/RoutesApi'
import { AboutErr, IError, TypeErr } from '../constants/EError'
import ServerDownPage from './ServerDownPage'

const Signin = () => {

	const [pseudo, setPseudo] = useState<string>("");
	const [pseudoErrorText, setPseudoErrorText] = useState<string>("")
	const [avatar, setAvatar] = useState<string>(AvatarDefault);
	const [avatarErrorText, setAvatarErrorText] = useState<string>("")
	const [avatarFile, setAvatarFile] = useState<File>()
	const [servorErrorText, setServorErrorText] = useState<string>("");
	const [isOkay, setIsOkay] = useState<boolean | undefined>();


	useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_PSEUDO_ROUTE)
				setPseudo(data.pseudo);
				if (pseudo)
					throw {
						about: AboutErr.PSEUDO,
						type: TypeErr.DUPLICATED
					} as IError
			} catch (err) {
				const _error: IError = err as IError;
				if (_error.about == AboutErr.PSEUDO && _error.type == TypeErr.DUPLICATED)
				{
					setIsOkay(false)
					ClientApi.redirect = new URL(BASE_URL)
				}
				else if (_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND)
					setIsOkay(true);
			}
		})()
	}, [pseudo])


	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setPseudoErrorText("")
		setAvatarErrorText("")
		setServorErrorText("")
		try {
			const formData = new FormData()
			if (pseudo)
				formData.append('pseudo', pseudo)
			if (avatar && avatarFile)
				formData.append("file", avatarFile, avatarFile.name)
			const data = await ClientApi.post(API_BASE_USER, formData)
			ClientApi.redirect = new URL(BASE_URL)
		} catch (err) {
			const _error: IError = err as IError
			const _err = err as {statusCode: number | string};
			// console.log("_error.about = ", _error.about)
			// console.log("_error = ", _error);
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
				else if (_error.about == AboutErr.AVATAR) {
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
		}
	}

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPseudo(event.target.value);
	}

	const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files)
		{
			// console.log("event.target.fiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiles[0] = ", event.target.files[0]);
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
					<p>Choose your pseudo</p>
					<input value={pseudo} type="text" 
					id="input1"
					placeholder="Enter your pseudo..."
					onChange={(e) => handleChangeName(e)}/>
					{pseudoErrorText && <p className='error-text'>{pseudoErrorText}</p>}
					<p>Choose your avatar</p>
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
					{servorErrorText && <p className='error-text'>{servorErrorText}</p>}
				</form>
			</div>
		)
	}
	

	return (
		<React.Fragment>
			{isOkay && getPage()}
			{isOkay == false && <ServerDownPage />}
		</React.Fragment>
	)
}

export default Signin;
