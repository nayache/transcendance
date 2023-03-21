import React, { useEffect, useRef, useState } from 'react'
import { Difficulty, GameDto, PlayerDto } from '../interface/IGame';
import '../styles/ModalGameMenu.css'
import DeclineInviteMenu from './DeclineInviteMenu';
import ErrorSearchPlayerMenu from './ErrorSearchPlayerMenu';
import InvitedMenu from './InvitedMenu';
import InviteNotRespondedMenu from './InviteNotRespondedMenu';

export enum ModalGameType {
	INVITED,
	ERRORSEARCHPLAYER,
	DECLINEINVIT,
	INVITNOTRESPONDED,
}

interface Props {
	active: boolean,
	type: ModalGameType,
	contentError?: string,
	pseudo?: string,
	author?: string,
	difficulty?: Difficulty,
	callback?: (props?: any) => any,
	callbackFail?: (props?: any) => any,
}

const ModalGameMenu = ({ active, type, contentError, pseudo, author, difficulty, callback, callbackFail }: Props) => {

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
					type === ModalGameType.ERRORSEARCHPLAYER && contentError
					&& <ErrorSearchPlayerMenu content={contentError}/> ||

					type === ModalGameType.INVITED && pseudo && author && difficulty
					&& <InvitedMenu pseudo={pseudo} author={author} difficulty={difficulty}
					onInvited={onInvited} /> ||

					type === ModalGameType.DECLINEINVIT
					&& <DeclineInviteMenu /> ||

					type === ModalGameType.INVITNOTRESPONDED
					&& <InviteNotRespondedMenu />
				}
			</div>
		</div>
	)
}

export default ModalGameMenu;