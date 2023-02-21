import React, { useEffect, useState } from "react"
import { API_PSEUDO_ROUTE, REGISTER_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import ClientApi from "./ClientApi.class";
import '../styles/Home.css'
import Crown from "../img/crown.png"
import Navbar from "./Navbar";
import ServerDownPage from "./ServerDownPage";
import { AboutErr, IError, TypeErr } from "../constants/error_constants";

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
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setIsOkay(false)
				else if (_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND )
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudo])

	const getPage = () => {
		
	//ajout de classements
	//historique des dernieres parties
	//(et si c pas trop chaud, chat general)

		return (
			<div>
				<Navbar/>
				<div className="home-container">
					<div>
						<div className="title-container">
							<h1 className="famous">THE FAMOUS</h1>
							<h1 className="writepong"> PONG ┅┅</h1>
							<h1 className="game">  ┅┅ GAME </h1>
						</div>
						<div className="reglejeu-container">
							<p className="reglejeu">Choose your game mode and compete against your friends !</p>
						</div>
					</div>
					<div>
						<div className="button-container">
							<button className="classic-game">
								classic
							</button>
							<button className="medium-game">
								medium
							</button>
							<button className="hard-game">
								hard
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<React.Fragment>
			{isOkay && getPage()}
			{isOkay == false && <ServerDownPage />}
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