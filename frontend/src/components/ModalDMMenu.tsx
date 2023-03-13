import React, { useEffect, useRef, useState } from 'react'
import { IUser } from '../interface/IUser';
import '../styles/ModalDMMenu.css'
import ChooseReceiverMenu from './ChooseReceiverMenu';

export enum ModalDMType {
	CHOOSERECEIVER,
}

interface Props {
	active: boolean,
	type: ModalDMType,
	user: IUser | undefined,
	callback?: (props?: any) => any,
	callbackFail?: (props?: any) => any,
}

const ModalDMMenu = ({ active, type, user, callback, callbackFail }: Props) => {

	const modalRef = useRef<HTMLDivElement>(null);


	const onChooseReceiver = (props?: any) => {
		console.log("onChooseReceiver")
		if (callback)
			callback(props)
	}

	useEffect(() => {
		console.log("type (dans modal) = ", type)
		console.log("active (dans modal) = ", active)
		if (modalRef.current) {
			modalRef.current.style.display = active ? "block" : "none";
		}
	}, [active])

	return (
		<div id="myDMModal-channelMenu"
		ref={modalRef} className="DMmodalChannelMenu">
			<div className="DMmodalChannelMenu-content">
				<span onClick={callbackFail}
				className="closeDM-channelMenu">&times;</span>
				{
					type === ModalDMType.CHOOSERECEIVER &&
					<ChooseReceiverMenu user={user} onChooseReceiver={onChooseReceiver} />
				}
			</div>
		</div>
	)
}

export default ModalDMMenu;