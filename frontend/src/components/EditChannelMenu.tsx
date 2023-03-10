import React, { useCallback, useEffect, useRef, useState } from "react"
import { API_CHAT_CHANNEL_PRVACCESS_ROUTE, API_CHAT_CHANNEL_PWDACCESS_ROUTE, API_CHAT_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelUser } from "../interface/IChannel";
import { MAX_CARAC_CHANNEL_NAME, MAX_CARAC_CHANNEL_PWD, MIN_CARAC_CHANNEL_NAME,
	MIN_CARAC_CHANNEL_PWD } from "./ChannelPart";
import ClientApi from "./ClientApi.class";
import { GiPadlock, GiPadlockOpen, GiOpenGate, GiGate } from "react-icons/gi"
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri"
import "../styles/ModalChannelMenu.css"
import "../styles/EditChannelMenu.css"
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { delay } from "../functions/Debug_utils";

interface Props {
	chanUser: IChannelUser,
	channelPrv: boolean,
	channelPassword: boolean,
	channelName: string,
	onEdit?: (props?: any) => void,
}

type BtnStatus = "idle" | "loading" | "good" | "fail"

const EditChannelMenu = ({ chanUser, channelName, channelPrv, channelPassword, onEdit }: Props) => {


	const passwordWritten = useRef<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [errorPassword, setErrorPassword] = useState<string>("")
	const inputRef = useRef<HTMLInputElement>(null);
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [btnStatusPrv, setBtnStatusPrv] = useState<BtnStatus>("idle")
	const [btnStatusPwd, setBtnStatusPwd] = useState<BtnStatus>("idle")
	const [password, setPassword] = useState<boolean>(channelPassword);
	const [prv, setPrv] = useState<boolean>(channelPrv);
	console.log("prv (dans edit channel) = ", prv)



	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		passwordWritten.current = e.target.value;
		console.log("passwordWritten.current = ", passwordWritten.current)
		if (inputRef.current &&
			inputRef.current.value.length >= MAX_CARAC_CHANNEL_NAME)
			console.log("max length reached")
		else
			console.log("okay good")
	}

	const handleSavePrv = () => {
		(async () => {
			try {
				await ClientApi.patch(API_CHAT_CHANNEL_PRVACCESS_ROUTE, JSON.stringify({
					name: channelName,
					prv,
				}), 'application/json')
				setBtnStatusPrv("good")
				setTimeout(() => setBtnStatusPrv("idle"), 2000)
				if (onEdit)
					onEdit({
						channelName,
						attribute: prv,
						action: "prv"})
				passwordWritten.current = ""
			} catch (err) {
				console.log("err = ", err);
				setBtnStatusPrv("fail")
				setTimeout(() => setBtnStatusPrv("idle"), 2000)
			}
		})()
	}

	const handleSavePassword = () => {
		setErrorPassword("");
		(async () => {
			try {
				console.log("passwordWritten.current = ", passwordWritten.current)
				await ClientApi.patch(API_CHAT_CHANNEL_PWDACCESS_ROUTE, JSON.stringify({
					name: channelName,
					password: passwordWritten.current,
				}), 'application/json')
				setBtnStatusPwd("good")
				setTimeout(() => setBtnStatusPwd("idle"), 2000)
				if (onEdit)
					onEdit({
						channelName,
						attribute: password,
						action: "pwd"})
				passwordWritten.current = ""
			} catch (err) {
				const _error: IError = err as IError;

				setBtnStatusPwd("fail")
				setTimeout(() => setBtnStatusPwd("idle"), 2000)
				if ((_error.about === AboutErr.REQUEST ||
					_error.about === AboutErr.CHANNEL) && _error.type === TypeErr.INVALID) {
					if (password && passwordWritten.current !== null) {
						if (passwordWritten.current.length < MIN_CARAC_CHANNEL_PWD)
							setErrorPassword("Please set a password longer (" + MIN_CARAC_CHANNEL_PWD + " char min)")
						else if (passwordWritten.current.length > MAX_CARAC_CHANNEL_PWD)
							setErrorPassword("Please set a password more little (" + MAX_CARAC_CHANNEL_PWD + " char max)")
						else if (passwordWritten.current.length >= MIN_CARAC_CHANNEL_NAME
						&& passwordWritten.current.length <= MAX_CARAC_CHANNEL_NAME) {
							let alphaCount: number = 0;
							for (let i = 0; i < passwordWritten.current.length; i++) {
								if (passwordWritten.current[i].length === 1 && passwordWritten.current[i].match(/[a-z]/i))
									alphaCount++;
							}
							if (passwordWritten.current.search(/\s/) !== -1)
								setErrorPassword("The password can't have whitespaces")
							else if (!(alphaCount >= 6))
								setErrorPassword("The password must have 6 letters minimum")
						}
					}
				}
			}
		})()
	}

	const printButtonSave = (btnStatus: BtnStatus,
		setBtnStatus: React.Dispatch<React.SetStateAction<BtnStatus>>,
		onClick?: () => void): JSX.Element => {
		switch (btnStatus) {
			case "idle":
				return (
					<div className="form-btn-container">
						<button onClick={() => {
							setBtnStatus("loading")
							if (onClick)
								onClick()
						}}
						className="form-save-button">Save</button>
					</div>
				)
			case "loading":
				return (
					<div className="form-btn-container">
						<svg id="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
							<defs>
								<linearGradient id="spinner-gradient-a" x1="49.892%" x2="55.03%" y1="58.241%" y2="89.889%">
									<stop offset="0%"/>
									<stop offset="22.44%" stopOpacity=".59"/>
									<stop offset="100%" stopOpacity="0"/>
								</linearGradient>
							</defs>
							<g fill="none" transform="translate(-8 -8)">
								<path d="M32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 C56,45.254834 45.254834,56 32,56 Z M32,52 C43.045695,52 52,43.045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 Z"/>
								<path fill="url(#spinner-gradient-a)" d="M56,32 C56,33.1045695 55.1045695,34 54,34 C52.8954305,34 52,33.1045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 C33.1045695,52 34,52.8954305 34,54 C34,55.1045695 33.1045695,56 32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 Z" transform="rotate(45 32 32)"/>
							</g>
						</svg>
					</div>
				)
			case "good":
				return (
					<div className="form-btn-container">
						<p>Good</p>
					</div>
				)
			case "fail":
				return (
					<div className="form-btn-container">

					</div>
				)
			default:
				return (
					<div className="form-btn-container">
						<button onClick={() => {
							setBtnStatus("loading")
							if (onClick)
								onClick()
						}}
						className="form-save-button" type="submit">Save</button>
					</div>
				)
		}
	}






	useEffect(() => {
		console.log("channelPassword = ", channelPassword)
		console.log("channelPrv = ", channelPrv)
		setPassword(channelPassword);
		setPrv(channelPrv);
	}, [channelName, channelPrv, channelPassword])

	useEffect(() => {
		console.log("btnStatusPrv = ", btnStatusPrv)
		console.log("btnStatusPwd = ", btnStatusPwd)
	}, [btnStatusPrv, btnStatusPwd])

	useEffect(() => {
		if (inputPwdRef.current) {
			if (!password) {
				inputPwdRef.current.value = ""
				setErrorPassword("")
				passwordWritten.current = null
			}
			else {
				passwordWritten.current = ""
			}
		}
	}, [password])

	



	return (
		<React.Fragment>
			<div className="editChannel-container">
				<div className="editChannel-title-container">
					<h3 className="editChannel-title">Edit the {channelName} channel</h3>
					{
						password && <GiPadlock className="padlock-svg" onClick={() => {setPassword(false)}} /> ||
						!password && <GiPadlockOpen className="padlock-svg" onClick={() => setPassword(true)} />
					}
				</div>
				<form className="editChannel-form">
					<div className="editChannel-prv">
						<label>Open to public 
						{
							prv && <GiGate className="gate-svg" onClick={() => {setPrv(false)}} /> ||
							!prv && <GiOpenGate className="gate-svg" onClick={() => {setPrv(true)}} />
						}</label>
						<label className="switch">
							<input type="checkbox" checked={!prv} onClick={() => setPrv(prv => !prv)} />
							<span className="slider round"></span>
						</label>
					</div>
					{ printButtonSave(btnStatusPrv, setBtnStatusPrv, () => handleSavePrv()) }
				</form>
				<form className="editChannel-form">
					<div className={(() => {
						if (!password)
							return "editChannel-password disabled-div-form"
						return "editChannel-password"
					})()}>
						<label>New password {
							password && (
								showPassword && <RiEyeFill className="eye-svg" onClick={() => setShowPassword(false)}/> ||
								!showPassword && <RiEyeCloseFill className="eye-svg" onClick={() => setShowPassword(true)}/>
							)
						}</label>
						<input ref={inputPwdRef} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
						className={(() => {
							if (errorPassword) 
								return "shaking-input"
							return undefined
						})()} onChange={handlePasswordChange}
						type={(() => {
							if (showPassword)
								return "text"
							else
								return "password"
						})()}
						disabled={!password} />
						{ password && errorPassword && <p className="error-text">{errorPassword}</p> }
					</div>
					{ printButtonSave(btnStatusPwd, setBtnStatusPwd, () => handleSavePassword()) }
				</form>
			</div>
		</React.Fragment>
	)
}

export default EditChannelMenu