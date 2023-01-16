import React from "react";

type FunctionDOMElement = (element: JSX.Element) => JSX.Element;

const redirect_to = (location: string) => {
	window.location.href = location
	return (
		<div>Gonna redirect to login page...</div>
	)
}

const verify_token = (token: string) => { // on pourrait en faire une promesse en vrai mais bon...
	// appels dans le back...
	return true;
}

export const getPrivateDOMElements: FunctionDOMElement = () => {
	const token: string | null = localStorage.getItem('token');
	if (!token)
		return redirect_to('/register');
	else {
		if (verify_token(token))
			return (
				<div></div>
			)
		}
	return redirect_to('/register')
}