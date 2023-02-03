import '../styles/Signin.css'
import AvatarDefault from '../img/avatar2.jpeg'
import React, { useEffect, useState } from "react"
import ClientApi from './ClientApi.class'
import { disableRedirectToSignin } from '../redux/user/userSlice'
import { patchUserAvatar } from '../redux/user/patchAvatarSlice'
import { patchUserPseudo } from '../redux/user/patchPseudoSlice'
import { useSelector } from "react-redux";
import { RootState } from '../redux/store'
import MiddlewareRedirectionPage from './MiddlewareRedirectionPage'

const Signin = () => {

	const reduxGetAvatar = useSelector((state: RootState) => state.getAvatar)
	const reduxPatchAvatar = useSelector((state: RootState) => state.patchAvatar)
	const reduxGetPseudo = useSelector((state: RootState) => state.getPseudo)
	const reduxPatchPseudo = useSelector((state: RootState) => state.patchPseudo)
	const [username, setUsername] = useState<string>("");
	const [avatar, setAvatar] = useState<string>(AvatarDefault);
	const [avatarFile, setAvatarFile] = useState<File | undefined>()
	const promiseAvatarFile = ClientApi.getFileFromImgSrc("default", AvatarDefault)


	useEffect(() => {
		ClientApi.dispatch(disableRedirectToSignin());
	}, [])


	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			if (!avatarFile)
				setAvatarFile(await promiseAvatarFile)
		} catch(err) {
			console.log("err = ", err)
		}
		console.log('username = ', username)
		console.log('avatar = ', avatar)
		console.log('avatarFile = ', avatarFile)
		ClientApi.dispatch(patchUserPseudo({ pseudo: username }))
		// if (reduxUser.error) 400 bad request mettre un message d'erreur pour le pseudo
		ClientApi.dispatch(patchUserAvatar({ avatar: avatarFile }))
		console.log("reduxPatchAvatar = ", reduxPatchAvatar);
		console.log("reduxPatchPseudo = ", reduxPatchPseudo);
		if (!reduxPatchAvatar.loading && !reduxPatchAvatar.patchAvatarError
		&& !reduxPatchPseudo.loading && !reduxPatchPseudo.patchPseudoError)
			ClientApi.redirect = "/"
	}

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	}

	const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files)
		{
			console.log("event.target.files[0] = ", event.target.files[0]);
			setAvatar(URL.createObjectURL(event.target.files[0]));
			setAvatarFile(event.target.files[0]);
		}
	}
	
	const getPage = () => {
		return (
			<div className="signIn">
				<form onSubmit={handleSubmit} encType="multipart/form-data"> 
					<h3>Choose your name</h3>
					<input value={username} type="text" 
					id="input1"
					placeholder="Enter your name..."
					onChange={handleChangeName}/>
					<h3>Choose your avatar</h3>
					<label htmlFor="fileChange">
						<input type="file" accept="image/png, image/jpeg" id="fileChange" hidden 
						onChange={handleChangeAvatar}/>
						<img src={avatar} alt="Avatar"/>
					</label>
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
			<MiddlewareRedirectionPage toReturn={getPage()}/>
		</React.Fragment>
	)
}

export default Signin;