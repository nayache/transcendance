import React, { useEffect } from "react"

export const useResizeText = (textRef: React.RefObject<HTMLParagraphElement>) => {

	useEffect(() => {
		if (textRef.current) {
			if (textRef.current.textContent
				&& textRef.current.textContent.length >= 25) {
					textRef.current.style.fontSize = "0.77em"
				}
			else if (textRef.current.textContent
			&& textRef.current.textContent.length > 16) {
				textRef.current.style.fontSize = "0.9em"
			}
		}
	}, [])

	return textRef;
}