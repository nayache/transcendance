import { useRef } from 'react'
import '../styles/Modal.css'

interface Props {
	active: boolean,
	title: string,
	content: string,
	callback?: () => any,
	callbackFail?: () => any,
}

const Modal = ({ active, title, content, callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);

	{
		if (active) {
			if (modalRef.current)
				modalRef.current.style.display = 'block';
		}
	}

	return (
		<div id="myModal" onClick={(event) => {
			if (modalRef.current && event.target == modalRef.current)
			{
				modalRef.current.style.display = "none";
				if (callbackFail)
					callbackFail();
			}
		}} ref={modalRef} className="modal">
			<div className="modal-content">
				<span onClick={() => {
					if (modalRef.current)
					{
						modalRef.current.style.display = 'none';
						if (callbackFail)
							callbackFail();
					}
				}} className="close">&times;</span>
				<h3>{title}</h3>				
				<p>{content}</p>				
        		<button type="button" onClick={() => {
					if (modalRef.current)
					{
						modalRef.current.style.display = 'none';
						if (callback)
							callback();
					}
				}} className="continuebtn">Continue</button>
			</div>
		</div>
	)
}

export default Modal;