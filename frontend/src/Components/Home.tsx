import React, { useEffect, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Ball from "./Ball.class";
import { useDispatch, useSelector } from "react-redux";
import { cakeActions } from "../Redux/Cake/CakeSlice";
import { getUserPseudo, patchUserPseudo } from "../Redux/User/userSlice";
import { AppDispatch, RootState } from "../Redux/store";

const Home = () => {

	// const urlGetPseudo = "./friends.json"
	const dispatch = useDispatch<AppDispatch>()
	const numOfCakes = useSelector((state: RootState) => state.cake.numOfCakes)
	const user = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const token = localStorage.token;
		const body = JSON.stringify({
			title: 'foo',
			body: 'bar',
			userId: 1,
		})

		console.log("home dans didMount")
		dispatch(patchUserPseudo({token}));
	}, [])

	useEffect(() => {
		console.log("user = ", user);
	}, [user])



	return (
		<React.Fragment>
			<Background />
			<Baseline title={"Ping pong"}/>
			<p>Ceci est un test : { numOfCakes }</p>
			<button onClick={() => dispatch(cakeActions.ordered(2))}></button>
			{user.loading && <p>Loading...</p>}
			{!user.loading && user.error && <h2>{user.error}</h2>}
			{/* {!user.loading && user.data && <h2>{user.data}</h2>} */}
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