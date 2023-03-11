import React, { useEffect, useRef, useState } from "react"
import { API_USER_ALL_NAMES } from "../constants/RoutesApi";
import { IUser } from "../interface/IUser";
import { BtnStatus } from "./Button";
import ClientApi from "./ClientApi.class";
import '../styles/ChooseReceiverMenu.css'

interface Props {
	onChooseReceiver?: (userName: string) => void,
	onChooseReceiverFail?: (userName: string) => void
}

const ChooseReceiverMenu = ({ onChooseReceiver, onChooseReceiverFail }: Props) => {


	const userWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [userNames, setUserNames] = useState<string[]>([]);
	const [visibleUserNames, setVisibleUserNames] = useState<string[]>([]);
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [btnStatus, setBtnStatus] = useState<BtnStatus>("idle")


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		userWritten.current = e.target.value;
		
		if (userWritten.current.trim().length == 0) {
			setVisibleUserNames(userNames);
			return ;
		}
		const returnedItems: string[] = userNames.filter(userName => (
			userName.toLocaleLowerCase().search(userWritten.current.trim().toLowerCase()) !== -1
		))
		setVisibleUserNames(returnedItems);
	}

	
	const printAboutUsers = () => {
		return (
			<div className="chooseReceiver-userNames-container">
				<div className="chooseReceiver-userNames-child">
					{ visibleUserNames?.map((visibleUserName, i) => (
						<div className="userbtn-container">
							<button onClick={() => {
								if (onChooseReceiver)
									onChooseReceiver(visibleUserName)
							}} className="userbtn button_without_style">
								<p className="userbtn-text">{visibleUserName}</p>
							</button>
						</div>
					)) }
				</div>
			</div>
		)
	}







	useEffect(() => {
		(async () => {
			try {
				const { names }: { names: string[] } = await ClientApi.get(API_USER_ALL_NAMES);
				console.log("names = ", names)
				setUserNames(names);
				setVisibleUserNames(names);
			} catch (err) {
				console.log("err = ", err);
				setUserNames(["bonsoir", "bsrtgb", "opseptg", "srtgbgrb", "esgvr", "srtgbtj", "qwdeac", "segvgdtyrj", "ergvwewafversgv", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890", "wwwwwwwwwwwwwwwwwwww", "12345678901234567890"])
				setVisibleUserNames(userNames);
			}
		})()
	}, [])







	return (
		<React.Fragment>
			<div className="chooseReceiver-container-container">
				<div className="chooseReceiver-container">
					<div className="chooseReceiver-child">
						<input spellCheck={false}
						ref={inputRef} className='chooseReceiver-input'
						placeholder='Search a user...'
						onChange={handleChange} />
						<div className="chooseReceiver-content-container">
							{ printAboutUsers() }
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default ChooseReceiverMenu