import React, { useRef } from 'react'
import '../styles/Modal.css'

interface Props {
	active: boolean,
	title: JSX.Element,
	content: JSX.Element,
	callback?: () => any,
	callbackFail?: () => any,
}

const Modal = ({ active, title, content, callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);


	const handleClick = (e: React.MouseEvent, visible: boolean, callback?: () => any | undefined) => {
		if (modalRef.current)
			modalRef.current.style.display = visible ? "block" : "none";
		if (callback)
			callback();
	}

	{
		if (active) {
			if (modalRef.current)
				modalRef.current.style.display = 'block';
		}
	}

	return (
		<div id="myModal" onClick={(e) => {
			if (e.target == modalRef.current)
				handleClick(e, false, callbackFail)
		}}
		ref={modalRef} className="modal">
			<div className="modal-content">
				<span onClick={(e) => handleClick(e, false, callbackFail)} className="close">&times;</span>
				<div>{title}</div>
				<div>{content}</div>
        		<button type="button" onClick={(e) => handleClick(e, false, callback)} className="continuebtn">Continue</button>
			</div>
		</div>
	)
}

export default Modal;