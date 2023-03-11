import Navbar from "./Navbar";
import '../styles/EnableTwoFASettings.css'
import '../styles/Toggle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiTriangle } from "react-icons/fi"
import Modal from "./Modal";
import ClientApi from "./ClientApi.class";
import { API_TWOFA_ROUTE } from "../constants/RoutesApi";
import ImgModal from "./ImgModal";

let differenceHeight: number = 0;

const EnableTwoFASettings = () => {

	const [ clicked, setClicked ] = useState<boolean>(false);
	const [ unrolled, setUnrolled ] = useState<[boolean, boolean]>();
	const [ rolledClassName, setRolledClassName ] = useState<string>("rolled");
	const [ rolledStyled, setRolledStyled ] = useState<any>({});
	const [ imgData, setImgData ] = useState<string>("");
	const containerActionRef = useRef<HTMLDivElement>(null);
	const containerContent = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLInputElement>(null);
	const [ modalTitle, setModalTitle ] = useState<JSX.Element>(
		<h3>Do you really want to re-generate your qr code</h3>
	);
	const [ modalContent, setModalContent ] = useState<JSX.Element>(
		<React.Fragment>
			<p>If you generate a new qr code, the old qr code already scanned will become obsolete.</p>
			<p>Are you sure you want to continue ?</p>
		</React.Fragment>
	);




	const handleMouseClick = useCallback(() => {
		console.log("mouse click")
		if (unrolled && !unrolled[0])
			setUnrolled(unrolled => [!unrolled![0], true])
	}, [unrolled])

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
			console.log("unrolled = true dans truc")
			setRolledStyled({
				marginTop: 0
			})
			setRolledClassName("unrolled")
			console.log("re roll or unroll...")
			if (regenerate)
				ClientApi.post(API_TWOFA_ROUTE, JSON.stringify({
					toggle: true
				}), 'application/json')
					.then(data => setImgData(data.qrcode))
			else
				ClientApi.get(API_TWOFA_ROUTE)
					.then(data => setImgData(data.qrcode))
		}
		else {
			console.log("unrolled = false dans truc")
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
	}, [unrolled])




	useEffect(() => {
		// if (containerContent.current && containerActionRef.current)
		// {
		// 	const contentRect = containerContent.current.getBoundingClientRect();
		// 	const actionRefRect = containerActionRef.current.getBoundingClientRect();
		// 	differenceHeight = (contentRect.y + contentRect.height) - (actionRefRect.y + actionRefRect.height)
		// }
		ClientApi.get(API_TWOFA_ROUTE)
			.then(data => {
				console.log("data.enabled = ", data.enabled)
				setUnrolled([data.enabled, false]);
			})
	}, [])

	useEffect(() => {
		if (unrolled)
			rollOrUnroll(unrolled[0], unrolled[1]);
	}, [unrolled])




	return (
		<React.Fragment>
			<div className="two-factor-content-container">
				{
					<Modal active={clicked && unrolled != undefined && unrolled[0]}
					title={modalTitle}
					content={modalContent}
					callback={() => {
						if (toggleRef.current && unrolled)
							toggleRef.current.checked = !unrolled[0]
						if (unrolled)
							setUnrolled(unrolled => [!unrolled![0], true])
						setClicked(false);
					}} callbackFail={() => {
						setClicked(false);
					}} />
				}
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
					{imgData && <ImgModal src={imgData} className="qrcode" />}
				</div>
			</div>
		</React.Fragment>
	)
}

export default EnableTwoFASettings