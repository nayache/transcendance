import '../styles/SignIn.css'
import AvatarDefault from './avatar2.jpeg'
import {useState} from "react"

const SignIn = () => {

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
            <h2>Choose your name</h2>
            <form onSubmit={handleSubmit}> 
                <input value={userName} type="text" 
                placeholder="Enter your name..."
                onChange={handleChangeName}/>
                <h2>Choose your avatar</h2>
                <label htmlFor="fileChange">
                    <img src={avatar} alt="Avatar"/>
                    <input type="file" id="fileChange" hidden 
                    onChange={handleChangeAvatar}/>
                </label>
                <br></br>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default SignIn; 