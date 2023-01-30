import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import ClientApi from './ClientApi.class';
import { disableRedirectToRegister } from '../redux/user/userSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import "../styles/Register.css"
import logo42 from "../img/42.jpg"

const Register: React.FC = () => {
	
	const domain: string = 'http://localhost:3042'
	const api42Url: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-21591b92686c701d5d9baf9f9d3e877072ef6d82b19483499cf3b942ed6cd5d8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code'
	const rawUrlParameters: string = window.location.search;
	const cleanUrlParameters: URLSearchParams = new URLSearchParams(rawUrlParameters);

	/**
	 * code vaut null au debut mais au second appel de <Register />
	 * avec "code" en parametre de l'url ("/register?code=ssfejjg") (cf window.location.href),
	 * "code" va valoir la valeur en parametre (en l'occurence 'ssfejjg')
	 */
	
	useEffect(() => {
		const code: string | null = cleanUrlParameters.get('code');
		
		ClientApi.dispatch(disableRedirectToRegister());
		try {
			if (code)
				ClientApi.register(code, '/');
		} catch (e) {
			console.log("e = ", e);
		}
	}, [])

	const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		window.location.href = api42Url;
	}
	
	return (
		<div className='Register'>
			<button onClick={onClick}> 
				<img src={logo42} alt="42"/>
			</button>
			<div className ="field">
			<div className ="net"></div>
			<div className="ping"></div>
			<div className="pong"></div>
			<div className="ball"></div>
			</div>
		</div>
	)
}

export default Register;
