import React, { useEffect, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import SignIn from "./SignIn";
import userReducer, { getUserPseudo, patchUserPseudo, UserProps, verifyToken } from '../redux/user/userSlice';
import ClientApi from "./ClientApi.class";
import { useSelector } from "react-redux";
import { RootState } from '../redux/store';
import Register from "./Register";

const Home = () => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);

    useEffect(() => {
        ClientApi.dispatch(verifyToken());
    }, [])

	useEffect(() => {
		if (reduxUser.redirectToRegister)
			ClientApi.redirect = ClientApi.registerRoute;
	}, [ reduxUser.redirectToRegister ])

	useEffect(() => {
		ClientApi.dispatch(getUserPseudo());
		console.log("reduxUser.user?.pseudo = ", reduxUser.user?.pseudo);
		if (reduxUser.user && !reduxUser.user?.pseudo)
			ClientApi.redirect = ClientApi.signinRoute;
	}, [ reduxUser.user?.pseudo ])


	const getPage = () => {
		return (
			<React.Fragment>
				<Background />
				<Baseline title={"Ping pong"}/>
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			{ reduxUser.redirectToRegister && <p>Redirect to intra 42 login...</p> }
			{ !reduxUser.redirectToRegister && getPage() }
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