import Navbar from "./Navbar";
import '../styles/EnableTwoFASettings.css'
import '../styles/Toggle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiTriangle } from "react-icons/fi"
import Modal from "./Modal";
import ClientApi from "./ClientApi.class";
import { API_GENERATE_TWOFA_ROUTE, API_TWOFA_ROUTE } from "../constants/RoutesApi";

let differenceHeight: number = 0;

const EnableTwoFASettings = () => {

	const [ clicked, setClicked ] = useState<boolean>(false);
	const [ unrolled, setUnrolled ] = useState<[boolean, boolean]>([false, false]);
	const [ rolledClassName, setRolledClassName ] = useState<string>("rolled");
	const [ rolledStyled, setRolledStyled ] = useState<any>({});
	const [ imgData, setImgData ] = useState<string>("");
	const [ modalTitle, setModalTitle ] = useState<string>("Do you really want to re-generate your qr code");
	const [ modalContent, setModalContent ] = useState<string>("If you generate a new qr code, the old qr code already scanned will become obsolete. Are you sure you want to continue ?");
	const containerActionRef = useRef<HTMLDivElement>(null);
	const containerContent = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLInputElement>(null);

	const handleMouseClick = useCallback(() => {
		console.log("mouse click")
		if (!unrolled[0])
			setUnrolled(unrolled => [!unrolled[0], true])
	}, [unrolled[0]])

	const handleMouseUp = useCallback(() => {
		setClicked(false);
	}, [])

	const handleMouseDown = useCallback(() => {
		setClicked(true);
	}, [])

	const rollOrUnroll = useCallback((unrolled: boolean, regenerate: boolean = true) => {
		console.log("differenceHeight = ", differenceHeight)
		console.log("regenerate = ", regenerate)
		if (unrolled) {
			setRolledStyled({
				marginTop: 0
			})
			setRolledClassName("unrolled")
			ClientApi.post(API_TWOFA_ROUTE, JSON.stringify({
				toggle: true
			}), 'application/json')
			if (regenerate)
				ClientApi.get(API_GENERATE_TWOFA_ROUTE)
					.then(data => setImgData(data.qrCode))
			else
				;// get another route with the previous image
		}
		else {
			setRolledStyled({
				marginTop: -differenceHeight
			})
			ClientApi.post(API_TWOFA_ROUTE, JSON.stringify({
				toggle: false
			}), 'application/json')
			setRolledClassName("rolled")
		}
		if (toggleRef.current)
			toggleRef.current.checked = unrolled
	}, [unrolled[0], unrolled[1]])


	useEffect(() => {
		if (containerContent.current && containerActionRef.current)
		{
			const contentRect = containerContent.current.getBoundingClientRect();
			const actionRefRect = containerActionRef.current.getBoundingClientRect();
			differenceHeight = (contentRect.y + contentRect.height) - (actionRefRect.y + actionRefRect.height)
		}
		ClientApi.get(API_TWOFA_ROUTE)
			.then(data => {
				setUnrolled([data.enabled, false]);
			})
	}, [])

	useEffect(() => {
		rollOrUnroll(unrolled[0], unrolled[1]);
	}, [unrolled[0], unrolled[1]])


	return (
		<React.Fragment>
			<div className="two-factor-content-container">
				<Modal active={clicked && unrolled[0]}
				title={modalTitle}
				content={modalContent}
				callback={() => {
					if (toggleRef.current)
						toggleRef.current.checked = !unrolled[0]
					setUnrolled(unrolled => [!unrolled[0], true])
					setClicked(false);
				}} callbackFail={() => {
					setClicked(false);
				}} />
				<div ref={containerActionRef} onClick={handleMouseClick}
				onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
				className="two-factor-clickable">
					<p className="two-factor-action">Enable two-factor authentication</p>
					<label className="svg switch">
						<input ref={toggleRef} type="checkbox" />
						<span className="slider round"></span>
					</label>
				</div>
				<div ref={containerContent} style={rolledStyled}
				className={"two-factor-content " + rolledClassName}>
					<p>Scan the qr code to sync with the google authenticator app :</p>
					{imgData && <img src={imgData} />}
				</div>
			</div>
		</React.Fragment>
	)
}

export default EnableTwoFASettings