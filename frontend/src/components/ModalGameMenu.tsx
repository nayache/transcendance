import React, { useEffect, useRef, useState } from 'react'
import { GameDto, PlayerDto } from '../interface/IGame';
import '../styles/ModalGameMenu.css'
import EndGameMenu from './EndGameMenu';

export enum ModalGameType {
	ENDGAME,
	OTHERENDGAME
}

interface Props {
	active: boolean,
	type: ModalGameType,
	pseudo: string,
	gameInfos?: GameDto,
	callback?: (props?: any) => any,
	callbackFail?: (props?: any) => any,
}

const ModalGameMenu = ({ active, type, pseudo, gameInfos, callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);


	const handleClick = (callback?: (props?: any) => any | undefined, e?: React.MouseEvent) => {
		if (callback)
			callback();
	}
	
	const onEndGame = (props?: any) => {
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
				<span onClick={(e) => handleClick(callbackFail)}
				className="close-GameMenu">&times;</span>
				{
					type === ModalGameType.ENDGAME && gameInfos
					&& <EndGameMenu gameInfos={gameInfos} pseudo={pseudo} onEndGame={onEndGame} /> ||

					type === ModalGameType.OTHERENDGAME && gameInfos
					&& <EndGameMenu gameInfos={gameInfos} pseudo={pseudo} onEndGame={onEndGame} />
				}
			</div>
		</div>
	)
}

export default ModalGameMenu;