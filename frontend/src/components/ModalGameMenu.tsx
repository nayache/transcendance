import React, { useEffect, useRef, useState } from 'react'
import { Difficulty, GameDto, PlayerDto } from '../interface/IGame';
import '../styles/ModalGameMenu.css'
import DeclineInviteMenu from './DeclineInviteMenu';
import ErrorSearchPlayerMenu from './ErrorSearchPlayerMenu';
import InvitedMenu from './InvitedMenu';

export enum ModalGameType {
	INVITED,
	ERRORSEARCHPLAYER,
	DECLINEINVIT,
}

interface Props {
	active: boolean,
	type: ModalGameType,
	pseudo?: string,
	author?: string,
	difficulty?: Difficulty,
	callback?: (props?: any) => any,
	callbackFail?: (props?: any) => any,
}

const ModalGameMenu = ({ active, type, pseudo, author, difficulty, callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);




	
	const onEndGame = (props?: any) => {
		if (callback)
			callback(props);
	}
	
	const onInvited = (props?: any) => {
		if (callback)
			callback(props);
	}




	useEffect(() => {
		console.log("type (dans modal) = ", type)
		console.log("active (dans modal) = ", active)
		if (modalRef.current) {
			modalRef.current.style.display = active ? "block" : "none";
		}
	}, [active])





	
	return (
		<div id="myModal-gameMenu"
		ref={modalRef} className="modalGameMenu">
			<div className="modalGameMenu-content">
				<span onClick={(e) => {
					if (callbackFail)
						callbackFail({author})
				}}
				className="close-GameMenu">&times;</span>
				{
					type === ModalGameType.ERRORSEARCHPLAYER
					&& <ErrorSearchPlayerMenu /> ||

					type === ModalGameType.INVITED && pseudo && author && difficulty
					&& <InvitedMenu pseudo={pseudo} author={author} difficulty={difficulty}
					onInvited={onInvited} /> ||

					type === ModalGameType.DECLINEINVIT
					&& <DeclineInviteMenu />
				}
			</div>
		</div>
	)
}

export default ModalGameMenu;