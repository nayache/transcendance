import React, { useEffect, useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import styled from "styled-components";
import ClientApi from "./ClientApi.class";
import { AppDispatch, RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";

const GamePage: React.FC = () => {

	useEffect(() => {
		const token = localStorage.token;
	}, [])
	
	useEffect(() => {
		if (ClientApi.reduxUser.redirectToRegister)
			ClientApi.redirect = '/register'
	}, [ClientApi.reduxUser])

	return (
		<React.Fragment>
			<Background />
			<Baseline title="Ping pong mais dans gamepage"/>
			<Playground />
		</React.Fragment>
	)
}
export default GamePage;