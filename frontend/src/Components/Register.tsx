import React from 'react'
import { useParams } from 'react-router-dom';

const Register: React.FC = () => {
	
	const domain: string = 'http://localhost:3042'
	const api42Url: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-21591b92686c701d5d9baf9f9d3e877072ef6d82b19483499cf3b942ed6cd5d8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code'
	const rawUrlParameters: string = window.location.search;
	const cleanUrlParameters: URLSearchParams = new URLSearchParams(rawUrlParameters);

	const code: string | null = cleanUrlParameters.get('code');
	/**
	 * code vaut null au debut mais au second appel de <Register />
	 * avec "code" en parametre de l'url ("/register?code=ssfejjg") (cf window.location.href),
	 * "code" va valoir la valeur en parametre (en l'occurence 'ssfejjg')
	 */
	const redirectDependingOnToken = async (location: string = '/') => {
		console.log('code = ', code)
		if (code)
		{
			try {
				const res: Response = await fetch(domain + '/auth?code=' + code + '1');
				console.log("code = ", code);
				console.log("res = ", res);
				const data = await res.json();
				localStorage.setItem('token', data.token);
				// window.location.href = location;
			} catch (e) {
				console.log("e = ", e); // dire de reessayer car probleme dans le fetch 
			}
		}
	}

	const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		window.location.href = api42Url;
	}

	redirectDependingOnToken('/');

	return (
		<React.Fragment>
			<button onClick={onClick}>Clique ici pour se log mgl</button>
		</React.Fragment>
	)
}
export default Register;
