import React, { useEffect, useState } from 'react'
import ClientApi from './ClientApi.class';
import "../styles/Register.css"
import logo42 from "../img/42.jpg"
import { BASE_URL } from '../constants/RoutesApi';

const Register: React.FC = () => {
	
	const [isOkay, setIsOkay] = useState<boolean>(false);
	const domain: string = 'http://localhost:3042'
	const api42Url: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-21591b92686c701d5d9baf9f9d3e877072ef6d82b19483499cf3b942ed6cd5d8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code'
	const rawUrlParameters: string = window.location.search;
	const cleanUrlParameters: URLSearchParams = new URLSearchParams(rawUrlParameters);

	
	useEffect(() => {
		/**
		 * code vaut null au debut mais au second appel de <Register />
		 * avec "code" en parametre de l'url ("/register?code=ssfejjg") (cf window.location.href),
		 * "code" va valoir la valeur en parametre (en l'occurence 'ssfejjg')
		 */
		(async () => {
			try{
				await ClientApi.verifyToken()
				setIsOkay(false) // si le token existe on a rien a faire sur cette page
				ClientApi.redirect = new URL(BASE_URL)
			} catch (err) {
				const code: string | null = cleanUrlParameters.get('code');
				
				setIsOkay(true);
				try {
					if (code)
						ClientApi.register(code, new URL(BASE_URL));
				} catch (err) {
					console.log("err = ", err);
				}
			}
		})()
	}, [])

	const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		window.location.href = api42Url;
	}
	
	const getPage = () => (
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

	return (
		<React.Fragment>
			{isOkay && getPage()}
		</React.Fragment>
	)
}

export default Register;
