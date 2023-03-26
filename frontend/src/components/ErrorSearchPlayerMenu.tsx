import React, { useCallback, useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class";
import '../styles/ErrorSearchPlayerMenu.css'
import { GameDto } from "../interface/IGame";


interface Props {
	content: string,
	onEndGame?: () => void
}

export const ErrorSearchPlayerMenu = ({ content, onEndGame }: Props) => {
	


	return (
		<React.Fragment>
			<div>
				<br/>
				<br/>
				<p>{content}</p>
			</div>
		</React.Fragment>
	)
}

export default ErrorSearchPlayerMenu