import React, { useEffect, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import SignIn from "./SignIn";
import userReducer, { getUserPseudo, patchUserPseudo, UserProps } from "../Redux/User/userSlice";
import ClientApi from "./ClientApi.class";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const Home = () => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const token = localStorage.token;
		const body = JSON.stringify({
			pseudo: 'alalongue170'
		})
		console.log("home dans didMount")
		ClientApi.dispatch(getUserPseudo());
	}, [])

	useEffect(() => {
		if (reduxUser.redirectToRegister)
			ClientApi.redirect = '/register'
	}, [reduxUser.redirectToRegister, ClientApi.token])


	return (
		<React.Fragment>
			<Background />
			<Baseline title={"Ping pong"}/>
			{/* {ClientApi.reduxUser.loading && <p>Loading...</p>}
			{!ClientApi.reduxUser.loading && ClientApi.reduxUser.error && <h2>{ClientApi.reduxUser.error}</h2>} */}
			{/* {!ClientApi.reduxUser.loading && ClientApi.reduxUser.data && <h2>{ClientApi.reduxUser.data}</h2>} */}
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