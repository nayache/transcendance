import Navbar from "./Navbar";
import '../styles/TwoFASettings.css'
import '../styles/Toggle.css'
import React, { useEffect, useRef, useState } from "react";
import { FiTriangle } from "react-icons/fi"


let differenceHeight: number = 0;

const TwoFASettings = () => {

	const [unrolled, setUnrolled] = useState<boolean>(false);
	const [rolledClassName, setRolledClassName] = useState<string>("rolled");
	const [rolledStyled, setRolledStyled] = useState<any>({});
	const containerActionRef = useRef<HTMLDivElement>(null);
	const containerContent = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		if (toggleRef.current)
			toggleRef.current.checked = !unrolled
		setUnrolled(unrolled => !unrolled);
	}


	useEffect(() => {
		if (containerContent.current && containerActionRef.current)
		{
			const contentRect = containerContent.current.getBoundingClientRect();
			const actionRefRect = containerActionRef.current.getBoundingClientRect();
			differenceHeight = (contentRect.y + contentRect.height) - (actionRefRect.y + actionRefRect.height)
		}
	}, [])

	useEffect(() => {
		console.log("differenceHeight = ", differenceHeight)
		if (unrolled)
		{
			setRolledStyled({
				marginTop: 0
			})
			setRolledClassName("unrolled")
		}
		else
		{
			setRolledStyled({
				marginTop: -differenceHeight
			})
			setRolledClassName("rolled")
		}
	}, [unrolled])

	return (
		<div>
			<Navbar />
			<div className="two-factor-containers">
				<h2>Two-factor authentication</h2>
				<div className="two-factor-content-container">
					<div ref={containerActionRef} onClick={handleClick} className="two-factor-clickable">
						<p className="two-factor-action">Enable two-factor authentication</p>
						<label className="svg switch">
							<input ref={toggleRef} type="checkbox" />
							<span className="slider round"></span>
						</label>
					</div>
					<div ref={containerContent} style={rolledStyled}
					className={"two-factor-content " + rolledClassName}>
						<p>test asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgftest asfvs dfvzsdjhbvgszjvcyjgfkdjhvbsjydgbvjgf </p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TwoFASettings