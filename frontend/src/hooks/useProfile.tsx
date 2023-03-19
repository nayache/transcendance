import { useEffect, useState } from "react";
import ClientApi from "../components/ClientApi.class";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { API_MYPROFILE_ROUTE, API_PSEUDO_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IProfile } from "../interface/IUser";

export const useProfile = () => {
	const [profile, setProfile] = useState<IProfile | undefined>()

	
	useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_MYPROFILE_ROUTE)
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
    }, [])


	return profile;
}