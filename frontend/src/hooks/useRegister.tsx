import { useCallback, useEffect, useState } from "react";
import ClientApi from "../components/ClientApi.class";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { BASE_URL, FTAPI_CODE_ROUTE_TO_REGISTER, FTAPI_CODE_ROUTE_TO_TWOFA } from "../constants/RoutesApi";

export enum PageCase {
	BEFORE_NORMAL,
	NORMAL,
	ERROR_CODE,
	ERROR_TWOFA,
	TOKEN_ALREADY_EXIST,
	TOKEN_CREATED,
}

export const useRegister = (now: boolean = true, twofa: string | null = null)
: [PageCase, (twofa?: string | null, code?: string | null) => Promise<void>] => {

	const getUrlCode = (): string | null => {
		const rawUrlParameters: string = window.location.search;
		const cleanUrlParameters: URLSearchParams = new URLSearchParams(rawUrlParameters);
		const code: string | null = cleanUrlParameters.get('code');
		return code;
	}

	const [code, setCode] = useState<string | null>(getUrlCode());
	const [pageCase, setPageCase] = useState<PageCase>(PageCase.BEFORE_NORMAL);


	const tryToRegister = useCallback(async function(twofa: string | null = null, code: string | null = getUrlCode()) {
		try {
			console.log("twofa = ", twofa, " et code = ", code);
			await ClientApi.register(async () => {
				// get /auth/2fa return true
				setPageCase(PageCase.TOKEN_CREATED);
			}, code, twofa);
		} catch (err) {
			const _error: IError = err as IError;
			
			console.log("err = ", err);
			if (_error.about == AboutErr.TWOFA && _error.type == TypeErr.REJECTED)
			{
				setPageCase(PageCase.ERROR_TWOFA);
			}
			else if (_error.about == AboutErr.AUTH && _error.type == TypeErr.INVALID)
			{
				setPageCase(PageCase.ERROR_CODE);
			}
		}
	}, [twofa, code])

	useEffect(() => {
		/**
		 * code vaut null au debut mais au second appel de <Register />
		 * avec "code" en parametre de l'url ("/register?code=ssfejjg") (cf window.location.href),
		 * "code" va valoir la valeur en parametre (en l'occurence 'ssfejjg')
		 */
		(async () => {
			try {
				await ClientApi.verifyToken()
				setPageCase(PageCase.TOKEN_ALREADY_EXIST)
			} catch (err) {
				setCode(getUrlCode())
				setPageCase(PageCase.NORMAL);
				if (code && now) {
					await tryToRegister(twofa, code);
				}
			}
		})()
	}, [code])

	return ([pageCase, tryToRegister])
}