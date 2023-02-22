import React, { ImgHTMLAttributes, useRef, useState } from "react"
import '../styles/ImgModal.css'

type MyProps = {

}

type Props = React.ComponentPropsWithoutRef<'img'> & MyProps

const ImgModal = ({ ...rest }: Props) => {

	const modalImgContainerRef = useRef<HTMLDivElement>(null);


	const handleClick = (e: React.MouseEvent, visible: boolean) => {
		if (modalImgContainerRef.current)
			modalImgContainerRef.current.style.display = visible ? "block" : 'none';
	}


	return (
		<React.Fragment>
			<img { ...rest } onClick={(e) => handleClick(e, true)} id="myImgBeforeModal" className={"imgBeforeModal " + rest.className} />
			<div ref={modalImgContainerRef}
			onClick={(e) => handleClick(e, false)}
			id="myImgModal-container"
			className="imgModal-container">
				<span onClick={(e) => handleClick(e, false)}
				className="closeImgModal">&times;</span>
				<img src={rest.src} className="imgModal-content" id="img01" />
				<div id="captionImgModal">{rest.alt}</div>
			</div>
		</React.Fragment>
	)
}

export default ImgModal;