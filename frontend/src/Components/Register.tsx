import React from 'react'
import { useParams } from 'react-router-dom';

const Register: React.FC = () => {
	
	const url: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e4321f4102944a4d6a845589617dc4dbb76d41480231e1640aa6a19b02a8a5a3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code'
	const rawUrlParameters: string = window.location.search;
	const cleanUrlParameters: URLSearchParams = new URLSearchParams(rawUrlParameters);

	console.log("window.location.search = ", window.location.search);
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		try {
			const res: Promise<Response> = fetch(url);
			const code: string | null = cleanUrlParameters.get('code');
			console.log("code = ", code)
		} catch(e) {

		}

	}

	return (
		<React.Fragment>
			<button onClick={onClick}>Clique ici pour se log mgl</button>
		</React.Fragment>
	)
}
export default Register;