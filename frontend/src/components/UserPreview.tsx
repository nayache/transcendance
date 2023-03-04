import React, { useEffect, useRef } from "react"
import '../styles/UserPreview.css'
import { Status } from "../constants/EMessage"
import { PROFILE_EP } from "../constants/RoutesApi"

interface Props {
	playername: string,
	status: Status,
	onClose?: (e?: React.MouseEvent<HTMLSpanElement>) => void,
}

interface ButtonProps {
	content: string,
	action: () => void,
}

/* to place juste before the element concerned */
const UserPreview = ({ playername, status, onClose }: Props) => {

	const containerRef = useRef<HTMLDivElement>(null);
	const buttons: ButtonProps[] = [
		{
			content: "See the profile",
			action: () => {

			}
		},
		{
			content: "Invite",
			action: () => {

			}
		},
		{
			content: "Send message",
			action: () => {

			}
		},
		{
			content: "Block",
			action: () => {

			}
		},
	]

	useEffect(() => {
		if (containerRef.current) {
			const topstyle = window.getComputedStyle(containerRef.current).top
			const top: number = +(topstyle.substring(0, topstyle.length - 2))
				- containerRef.current.getBoundingClientRect().height
			console.log("topstyle = ", topstyle)
			console.log("top = ", top)
			if (top < 0) {
				containerRef.current.style.top = 0 + containerRef.current.getBoundingClientRect().height + "px"
			}
		}
	}, [])


	return (
		<div ref={containerRef} className="userPreview-container">
			<div className="userPreview_with_close">
				<div className="userPreview_without_close">
					<p className="pseudo">{playername}</p>
					{
						buttons.map(({content, action}: ButtonProps, index: number) => {
							if (index === 0)
								return (
									<React.Fragment key={index}>
										<div className="first-element-container">
											<button onClick={action} className="preview-button button_without_style" >{content}</button>
										</div>
									</React.Fragment>
								)
							else
								return (
									<div key={index}>
										<button onClick={action} className="preview-button button_without_style">{content}</button>
									</div>
								)
						})
					}
				</div>
				<span onClick={onClose} className="close-preview">&times;</span>
			</div>
		</div>
	)
}

export default UserPreview