import React, { useEffect, useState } from "react"
import { UserProps } from '../redux/user/userSlice';
import { getVerifyToken, VerifyTokenProps } from "../redux/user/getVerifyTokenSlice";
import ClientApi from "./ClientApi.class";
import { useSelector } from "react-redux";
import { RootState } from '../redux/store';

interface Props {
	toReturn: JSX.Element
}

const MiddlewareRedirectionPage = ({ toReturn }: Props) => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);
	const reduxGetVerifyToken: VerifyTokenProps = useSelector((state: RootState) => state.getVerifyToken);

	useEffect(() => {
        ClientApi.dispatch(getVerifyToken());
    }, [])

	useEffect(() => {
		console.log("reduxUser.redirectToRegister = ", reduxUser.redirectToRegister)
		if (doRedirectToRegister())
			ClientApi.redirect = ClientApi.registerRoute;
	}, [ reduxUser.redirectToRegister ])
	
	useEffect(() => {
		console.log("reduxUser.redirectToSignin = ", reduxUser.redirectToSignin)
		if (doRedirectToSignin())
			ClientApi.redirect = ClientApi.signinRoute;
	}, [ reduxUser.redirectToSignin ])

	const doRedirectToRegister = (): boolean => {
		return (reduxUser.redirectToRegister != undefined && reduxUser.redirectToRegister)
	}
	
	const doRedirectToSignin = (): boolean => {
		return (reduxUser.redirectToSignin != undefined && reduxUser.redirectToSignin)
	}
	
	const getGoodReturn = (): JSX.Element => {
		if (reduxUser.loading)
		{
			console.log("it is loading")
			if (doRedirectToRegister())
				return (<p>Redirect to intra 42 login...</p>)
			else if (doRedirectToSignin())
				return (<p>Redirect to signin page...</p>)
		}
		else {
			if (!doRedirectToRegister() && !doRedirectToSignin())
			{
				if (reduxGetVerifyToken.getVerifyTokenError?.name != '401')
					return toReturn;
				else
				{
					console.log("reduxUser.error = ", reduxGetVerifyToken.getVerifyTokenError)
					return <div>Failed to fetch an api. Try to relog later</div>
				}
			}
		}
		return <></>
	}

	return (
		<React.Fragment>
			{ getGoodReturn() }
		</React.Fragment>
	)
}

export default MiddlewareRedirectionPage;