import React from 'react'
import { useParams } from 'react-router-dom';

const Register: React.FC = () => {
	
	const domain: string = 'localhost:3042'
	const api42Url: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e4321f4102944a4d6a845589617dc4dbb76d41480231e1640aa6a19b02a8a5a3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code'
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
				const res: Response = await fetch(domain + '/auth?code=' + code);
				const data = await res.json();
				localStorage.setItem('token', JSON.stringify(data));
				window.location.href = location;
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