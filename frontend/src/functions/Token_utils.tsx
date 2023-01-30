import React from "react";

type FunctionDOMElement = (element: JSX.Element) => Promise<JSX.Element>;

const redirect_to = (location: string) => {
	window.location.href = location
	return (
		<div>Gonna redirect to login page...</div>
	)
}

const verify_token = async (token: string) => { // on pourrait en faire une promesse en vrai mais bon...
	// await fetch()
	return true;
}

// peut etre utilisé redux pour faire un genre de middleware
// export const getPrivateDOMElements: FunctionDOMElement = (element: JSX.Element) => {
// 	const token: string | null = localStorage.getItem('token');
// 	if (!token)
// 		return redirect_to('/register');
// 	else {
// 		if (verify_token(token))
// 			return element;
// 		}
// 	return redirect_to('/register')
// }