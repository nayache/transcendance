import '../styles/SignIn.css'
import AvatarDefault from '../img/avatar2.jpeg'
import { useEffect, useState } from "react"
import React from "react"
import ClientApi from './ClientApi.class'
import { getUserPseudo, UserProps, verifyToken } from '../redux/user/userSlice'
import { useSelector } from "react-redux";
import { RootState } from '../redux/store'

const SignIn = () => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);

    useEffect(() => {
        ClientApi.dispatch(verifyToken());
    }, [])
    
	useEffect(() => {
		if (reduxUser.redirectToRegister)
			ClientApi.redirect = ClientApi.registerRoute;
	}, [ reduxUser.redirectToRegister ])

	useEffect(() => {
		ClientApi.dispatch(getUserPseudo());
        console.log("reduxUser.user?.pseudo = ", reduxUser.user?.pseudo);
		if (reduxUser.user && reduxUser.user?.pseudo)
			ClientApi.redirect = '/';
	}, [ reduxUser.user?.pseudo ])

    const [userName, setUserName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>(AvatarDefault);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    }

    const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files)
            setAvatar(URL.createObjectURL(event.target.files[0]));
    }
    
    return (
        <div className="signIn">
            <form onSubmit={handleSubmit}> 
                <h3>Choose your name</h3>
                <input value={userName} type="text" 
                id="input1"
                placeholder="Enter your name..."
                onChange={handleChangeName}/>
                <h3>Choose your avatar</h3>
                <label htmlFor="fileChange">
                    <img src={avatar} alt="Avatar"/>
                    <input type="file" id="fileChange" hidden 
                    onChange={handleChangeAvatar}/>
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

export default SignIn;