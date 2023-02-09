import React, { useEffect, useState } from "react"
import { API_PSEUDO_ROUTE, REGISTER_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import ClientApi from "./ClientApi.class";
import Navbar from "./Navbar";

const Home = () => {

	const [isOkay, setIsOkay] = useState<boolean | undefined>();
	const [pseudo, setPseudo] = useState<string>();

    useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_PSEUDO_ROUTE)
				console.log("data.pseudo = ", data.pseudo)
				setPseudo(data.pseudo)
				console.log("pseudo = ", pseudo)
				if (pseudo)
					setIsOkay(true);
			} catch (err) {
				console.log('error')
				console.log('err = ', err)
				setIsOkay(false);
				if (!pseudo)
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudo])

	const getPage = () => {
		return (
			<React.Fragment>
				<Navbar />
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			{isOkay && getPage()}
		</React.Fragment>
	)
}
export default Home;

/*
si local storage n'a pas de token
	rediriger vers ma page /register (=> bouton qui sign in sur 42 : myUrl)
		Prendre la variable code pour l'envoyer au back (en parametre de la route /auth de notre api)
			Storer le token renvoyé du back
				Le sauvegarder dans le local storage
	
myUrl = https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e4321f4102944a4d6a845589617dc4dbb76d41480231e1640aa6a19b02a8a5a3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code 
*/