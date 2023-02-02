import '../styles/Signin.css'
import AvatarDefault from '../img/avatar2.jpeg'
import { useEffect, useState } from "react"
import React from "react"
import ClientApi from './ClientApi.class'
import { disableRedirectToSignin, getUserPseudo, patchUserPseudo, UserProps, verifyToken } from '../redux/user/userSlice'
import { useSelector } from "react-redux";
import { RootState } from '../redux/store'
import Home from './Home'
import MiddlewareRedirectionPage from './MiddlewareRedirectionPage'

const Signin = () => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);
	const [username, setUsername] = useState<string>("");
	const [avatar, setAvatar] = useState<string>(AvatarDefault);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);


	useEffect(() => {
		ClientApi.dispatch(disableRedirectToSignin());
	}, [])

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		console.log('username = ', username)
		console.log('avatar = ', avatar)
		// ClientApi.dispatch(patchUserPseudo({ username }))
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
					<input type="checkbox" id="input2" />Activate two-factor authentication
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