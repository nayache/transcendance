import { useEffect, useState } from "react";
import ClientApi from "../components/ClientApi.class";
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { API_AVATAR_ROUTE } from "../constants/RoutesApi";
import DefaultImg from "../img/avatar2.jpeg"

export const useAvatar = () => {
	const [avatar, setAvatar] = useState<string | undefined>(undefined)

	
	useEffect(() => {
		(async () => {
			try {
				const data = await ClientApi.get(API_AVATAR_ROUTE)
				console.log("data.avatar = ", data.avatar)
				setAvatar(data.avatar ? data.avatar : DefaultImg)
				console.log("avatar = ", avatar)
			} catch (err) {
				const _typeError: TypeError = err as TypeError;
				const _error: IError = err as IError;
				if (_typeError.name == "TypeError")
					setAvatar(DefaultImg)
			}
		})()
    }, [avatar])



	return avatar;
}