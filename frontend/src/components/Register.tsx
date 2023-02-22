import React, { useEffect, useState } from 'react'
import ClientApi from './ClientApi.class';
import "../styles/Register.css"
import logo42 from "../img/42.jpg"
import { BASE_URL, FTAPI_CODE_ROUTE_TO_REGISTER, FTAPI_CODE_ROUTE_TO_TWOFA } from '../constants/RoutesApi';
import ServerDownPage from './ServerDownPage';
import TwoFA from './TwoFA';
import { AboutErr, IError, TypeErr } from '../constants/error_constants';
import { PageCase, useRegister } from '../hooks/useRegister';
import { useSocket } from '../hooks/useSocket';

const Register: React.FC = () => {
	
	const [page, setPage] = useState<JSX.Element>(<></>);
	const [errorDom, setErrorDom] = useState<JSX.Element>(<React.Fragment />);
	const [pageCase] = useRegister();


	const triggerCode = (path: string) => {
		if (path == 'register')
			window.location.href = FTAPI_CODE_ROUTE_TO_REGISTER;
		else if (path == 'twofa')
			window.location.href = FTAPI_CODE_ROUTE_TO_TWOFA;
	}


	useEffect(() => {
		switch (pageCase) {
			case PageCase.TOKEN_ALREADY_EXIST:
				// si le token existe on a rien a faire sur cette page a part si twofa
				ClientApi.redirect = new URL(BASE_URL)
				break;
			case PageCase.NORMAL:
				setPage(
					<div className='Register'>
						<button onClick={() => triggerCode('register')}> 
							<img src={logo42} alt="42"/>
						</button>
						<div className ="field">
						<div className ="net"></div>
						<div className="ping"></div>
						<div className="pong"></div>
						<div className="ball"></div>
						</div>
					</div>
				)
				break;
			case PageCase.TOKEN_CREATED:
				ClientApi.redirect = new URL(BASE_URL);
				break;
			case PageCase.ERROR_CODE:
				setErrorDom(
					<p className='error_text'>Sorry, please try to connect again...</p>
				)
				break;
			case PageCase.ERROR_TWOFA:
				triggerCode('twofa');
				break;
		}
	}, [pageCase])

	useEffect(() => {
		setPage(
			<div className='Register'>
				<button onClick={() => triggerCode('register')}> 
					<img src={logo42} alt="42"/>
				</button>
				{ errorDom }
				<div className ="field">
				<div className ="net"></div>
				<div className="ping"></div>
				<div className="pong"></div>
				<div className="ball"></div>
				</div>
			</div>
		)
	}, [errorDom])

	return (
		<React.Fragment>
			{ page }
		</React.Fragment>
	)
}

export default Register;
