import '../styles/Signin.css'
import AvatarDefault from '../img/avatar2.jpeg'
import { useEffect, useState } from "react"
import React from "react"
import ClientApi from './ClientApi.class'
import { disableRedirectToSignin, getUserPseudo, UserProps, verifyToken } from '../redux/user/userSlice'
import { useSelector } from "react-redux";
import { RootState } from '../redux/store'
import Home from './Home'
import MiddlewareRedirectionPage from './MiddlewareRedirectionPage'

const Signin = () => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);
    const [userName, setUserName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>(AvatarDefault);


    useEffect(() => {
		ClientApi.dispatch(disableRedirectToSignin());
    }, [])

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
    
    const getPage = () => {
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
    
    return (
        <React.Fragment>
            <MiddlewareRedirectionPage toReturn={getPage()}/>
        </React.Fragment>
    )
}

export default Signin;