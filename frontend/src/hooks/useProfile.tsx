import { useEffect, useState } from "react";
import ClientApi from "../components/ClientApi.class";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { API_PROFILE_ROUTE, API_PSEUDO_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IProfile } from "../interface/IUser";

export const useProfile = (pseudo?: string) => {
	const [profile, setProfile] = useState<IProfile | undefined>()

	
	useEffect(() => {
		(async () => {
			try {
				const route: string = pseudo ? API_PROFILE_ROUTE + '/' + pseudo : API_PROFILE_ROUTE
				const data = await ClientApi.get(route)
				console.log("data.profile = ", data.profile)
				setProfile(data.profile)
				console.log("profile = ", profile)
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setProfile(undefined)
				else if (
					_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND
				)
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudo])


	return profile;
}