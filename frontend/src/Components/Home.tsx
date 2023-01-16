import React, { useState } from "react"
import Background from './Background'
import styled from "styled-components";

const TitleDiv = styled.div`
	position: relative;
	width: fit-content;
	margin: auto;
`

const Title = styled.p`
	position: relative;
	width: fit-content;
	margin: auto;
	font-size: 3rem;
`

const Home = () => {

	const [title, setTitle] = useState('Pong')

	console.log('localStorage = ', localStorage);

	const getTitle = () => {
		return (
			<TitleDiv>
				<Title>{title}</Title>
			</TitleDiv>
		)
	}

	return (
		<React.Fragment>
			<Background />
			{ getTitle() }
		</React.Fragment>
	)
}
export default Home;

/*
si local storage n'a pas de token
	rediriger vers ma page /register (=> bouton qui sign in sur 42 : myUrl)
		Prendre le code pour envoyer au back (en parametre /auth de notre api)
			Storer le token renvoyé du back
				Le sauvegarder dans le local storage
	
myUrl = https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e4321f4102944a4d6a845589617dc4dbb76d41480231e1640aa6a19b02a8a5a3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code 
*/