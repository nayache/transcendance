import React, { useCallback, useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class";
import '../styles/ErrorSearchPlayerMenu.css'
import { GameDto } from "../interface/IGame";


interface Props {
	onEndGame?: () => void
}

export const ErrorSearchPlayerMenu = ({ onEndGame }: Props) => {
	


	return (
		<React.Fragment>
			<div>
				<p>Sorry, the server is currently down</p>
			</div>
		</React.Fragment>
	)
}

export default ErrorSearchPlayerMenu