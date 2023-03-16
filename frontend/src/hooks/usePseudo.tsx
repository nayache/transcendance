import { useEffect, useState } from "react";
import ClientApi from "../components/ClientApi.class";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { API_PSEUDO_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";

export const usePseudo = () => {
	const [pseudo, setPseudo] = useState<string | undefined>('')

	
	useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_PSEUDO_ROUTE)
				console.log("data.pseudo = ", data.pseudo)
				setPseudo(data.pseudo)
				console.log("pseudo = ", pseudo)
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setPseudo(undefined)
				else if (
					_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND
				)
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudo])



	return pseudo;
}