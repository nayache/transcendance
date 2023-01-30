import React, { useEffect, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import styled from "styled-components";
import ClientApi from "./ClientApi.class";
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { UserProps } from '../redux/user/userSlice';

const GamePage: React.FC = () => {

	const reduxUser: UserProps = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const token = localStorage.token;
	}, [])

	useEffect(() => {
		if (reduxUser.redirectToRegister)
			ClientApi.redirect = '/register'
	}, [reduxUser.redirectToRegister])

	return (
		<React.Fragment>
			<Background />
			<Baseline title="Ping pong mais dans gamepage"/>
			<Playground />
		</React.Fragment>
	)
}
export default GamePage;