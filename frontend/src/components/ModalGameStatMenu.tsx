import React, { useEffect, useRef, useState } from 'react'
import { GameDto, PlayerDto } from '../interface/IGame';
import '../styles/ModalGameStatMenu.css'
import EndGameMenu from './EndGameMenu';
import OtherEndGameMenu from './OtherEndGameMenu';

export enum ModalGameStatType {
	ENDGAME,
	OTHERENDGAME,
}

interface Props {
	active: boolean,
	type: ModalGameStatType,
	pseudo: string,
	gameInfos?: GameDto,
	callback?: (props?: any) => any,
	callbackFail?: (props?: any) => any,
}

const ModalGameStatMenu = ({ active, type, pseudo, gameInfos, callback, callbackFail }: Props) => {

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
		// console.log("type (dans modal) = ", type)
		// console.log("active (dans modal) = ", active)
		if (modalRef.current) {
			modalRef.current.style.display = active ? "block" : "none";
		}
	}, [active])

	return (
		<div id="myModal-gameStatMenu"
		ref={modalRef} className="modalGameStatMenu">
			<div className="modalGameStatMenu-content">
				<span onClick={(e) => handleClick(callbackFail)}
				className="close-GameStatMenu">&times;</span>
				{
					type === ModalGameStatType.ENDGAME && gameInfos
					&& <EndGameMenu gameInfos={gameInfos} pseudo={pseudo} onEndGame={onEndGame} /> ||

					type === ModalGameStatType.OTHERENDGAME && gameInfos
					&& <OtherEndGameMenu gameInfos={gameInfos} pseudo={pseudo} onEndGame={onEndGame} />	
				}
			</div>
		</div>
	)
}

export default ModalGameStatMenu;
