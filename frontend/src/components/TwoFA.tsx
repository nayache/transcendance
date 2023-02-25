import React, { useEffect } from "react";
import {useState, FC, useRef } from "react"
import { AboutErr, IError, TypeErr } from "../constants/error_constants";
import { BASE_URL, FTAPI_CODE_ROUTE_TO_REGISTER, FTAPI_CODE_ROUTE_TO_TWOFA, REGISTER_ROUTE } from "../constants/RoutesApi";
import { PageCase, useRegister } from "../hooks/useRegister";
import "../styles/TwoFA.css"
import ClientApi from "./ClientApi.class";

const TwoFA = () => {
	
	const [page, setPage] = useState<JSX.Element>(<></>);
	const [errorDom, setErrorDom] = useState<JSX.Element>(<React.Fragment />);
	const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
	const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
	const inputRef = useRef<HTMLInputElement>(null)
	const [pageCase, tryToRegister] = useRegister(false, otp.join(''))


	const triggerCode = (path: string) => {
		if (path == 'register')
			window.location.href = FTAPI_CODE_ROUTE_TO_REGISTER;
		else if (path == 'twofa')
			window.location.href = FTAPI_CODE_ROUTE_TO_TWOFA;
	}

	const clearOTP = () => {
		setActiveOTPIndex(0);
		setOtp(oldOtp => oldOtp.fill(""));
	}

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, index: number): void => {
		const { value } = event.target;
		const newOTP: string[] = [...otp]

		console.log("value = ", value)
		newOTP[index] = value.substring(value.length - 1);
		if (value)
			setActiveOTPIndex(index + 1)
		setOtp(newOTP)
	}

	const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (!(event.key >= '0' && event.key <= '9'
		|| event.key === 'Backspace'))
			event.preventDefault();
		if (event.repeat && event.key === 'Backspace')
			clearOTP();
		if(event.key === 'ArrowLeft')
			setActiveOTPIndex(index - 1)
		else if(event.key === 'ArrowRight')
			setActiveOTPIndex(index + 1)
	}

	const handleOnMouseDown = (index: number) => {
		console.log("index (dans mousedown) = ", index)
		setActiveOTPIndex(index);
	}


	useEffect(() => {
		switch (pageCase) {
			case PageCase.TOKEN_ALREADY_EXIST:
				// si le token existe on a rien a faire sur cette page a part si twofa
				ClientApi.redirect = new URL(BASE_URL)
				break;
			case PageCase.NORMAL:
				setPage(
					<div className="containers-authentication">
						<h2 className="twofac-title">TWO-FACTOR</h2>
						<h2 className="twofac2-title">AUTHENTICATION</h2>
						<div className="full-line"/>
						<p className="digit-text">Enter 6-digit code from your authenticator application</p>
						<div className="containers-number">
							{otp.map((_, index) => (
								<React.Fragment key={index}>
									<label className="label-input-user">
										<input 
										className="input-containers"
										ref={index === activeOTPIndex ? inputRef : null}
										
										onMouseDown={() => handleOnMouseDown(index)}
										onKeyDown={(e) => handleOnKeyDown(e, index)}
										onChange={(e) => handleOnChange(e, index)}
										value={otp[index]}/>
									</label>
								</React.Fragment>
							))}
						</div>
					</div>
				)
				break;
			case PageCase.TOKEN_CREATED:
				ClientApi.redirect = new URL(BASE_URL);
				break;
			case PageCase.ERROR_CODE:
				setErrorDom(
					<p className="error_text">Sorry, please try to connect again...</p>
				)
				ClientApi.redirect = new URL(REGISTER_ROUTE);
				break;
			case PageCase.ERROR_TWOFA:
				triggerCode('twofa');
				setErrorDom(
					<p className="error_text">The code number is not good</p>
				)
				break;
		}
	}, [pageCase])

	useEffect(() => {
		inputRef.current?.focus() // if already focus, do nothing, I think...
	}, [activeOTPIndex])

	useEffect(() => {
		(async () => {
			const allFilled: boolean = !otp.some(value => value == '');
		
			if (allFilled)
			{
				console.log("that's good");
				await tryToRegister(otp.join(''))
			}
			console.log("otp = ", otp);
		})()
	}, [otp])

	return (
		<div className="containers-authentication">
			<h2 className="twofac-title">TWO-FACTOR</h2>
			<h2 className="twofac2-title">AUTHENTICATION</h2>
			<div className="full-line"/>
			<p className="digit-text">Enter 6-digit code from your authenticator application</p>
			<div className="containers-number">
				{otp.map((_, index) => (
					<React.Fragment key={index}>
						<label className="label-input-user">
							<input 
							className="input-containers"
							ref={index === activeOTPIndex ? inputRef : null}
							
							onMouseDown={() => handleOnMouseDown(index)}
							onKeyDown={(e) => handleOnKeyDown(e, index)}
							onChange={(e) => handleOnChange(e, index)}
							value={otp[index]}/>
						</label>
					</React.Fragment>
				))}
			</div>
			{ errorDom }
		</div>
	);
}

export default TwoFA;