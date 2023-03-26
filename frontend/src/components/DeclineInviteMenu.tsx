import React, { useCallback, useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class";
import '../styles/DeclineInviteMenu.css'
import { GameDto } from "../interface/IGame";


interface Props {
}

export const DeclineInviteMenu = () => {
	


	return (
		<React.Fragment>
			<div>
				<br/>
				<br/>
				<p>The player invited declined your invitation...</p>
			</div>
		</React.Fragment>
	)
}

export default DeclineInviteMenu