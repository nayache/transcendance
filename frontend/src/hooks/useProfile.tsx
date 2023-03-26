import { useEffect, useState } from "react";
import ClientApi from "../components/ClientApi.class";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { API_PROFILE_ROUTE, API_PSEUDO_ROUTE, SIGNIN_ROUTE } from "../constants/RoutesApi";
import { IProfile } from "../interface/IUser";
import DefaultImg from "../img/avatar2.jpeg"

export const useProfile = (pseudoParam?: string): [IProfile | null | undefined, unknown | undefined | null] => {
	const [profile, setProfile] = useState<IProfile | undefined | null>(null)
	const [error, setError] = useState<unknown | undefined | null>(null)

	
	useEffect(() => {
		(async () => {
			try {
				const route: string = pseudoParam ? API_PROFILE_ROUTE + '/' + pseudoParam : API_PROFILE_ROUTE
				const data: { profile: IProfile } = await ClientApi.get(route)
				// console.log("data.profile (avant remaniage) = ", data.profile)
				data.profile.level = Math.round(data.profile.level)
				data.profile.percentageXp = Math.round(data.profile.percentageXp)
				data.profile.requiredXp = Math.round(data.profile.requiredXp)
				data.profile.xp = Math.round(data.profile.xp)
				data.profile.avatar = data.profile.avatar ? data.profile.avatar : DefaultImg
				// console.log("data.profile (apres remaniage) = ", data.profile)
				setProfile(data.profile)
				setError(undefined)
				// console.log("profile = ", profile)
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;

				setError(err)
				if (_typeError.name == "TypeError")
					setProfile(undefined)
				else if (
					_error.about == AboutErr.PSEUDO && _error.type == TypeErr.NOT_FOUND
				)
					ClientApi.redirect = new URL(SIGNIN_ROUTE)
			}
		})()
    }, [pseudoParam])


	return [profile, error];
}
