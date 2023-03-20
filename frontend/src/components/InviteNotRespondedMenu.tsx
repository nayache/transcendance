import React, { useCallback, useEffect, useRef, useState } from "react"
import ClientApi from "./ClientApi.class";
import '../styles/InviteNotRespondedMenu.css'
import { GameDto } from "../interface/IGame";


interface Props {
}

export const InviteNotRespondedMenu = () => {
	


	return (
		<React.Fragment>
			<div>
				<br/>
				<br/>
				<p>The player invited did not responded to your invitation...</p>
			</div>
		</React.Fragment>
	)
}

export default InviteNotRespondedMenu