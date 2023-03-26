import React, { useEffect, useRef, useState } from "react"
import { API_USER_ALL, API_USER_ALL_NAMES } from "../constants/RoutesApi";
import { IUser } from "../interface/IUser";
import { BtnStatus } from "./Button";
import ClientApi from "./ClientApi.class";
import '../styles/ChooseReceiverMenu.css'
import Avatar from "./Avatar";

interface Props {
	user: IUser | undefined,
	onChooseReceiver?: (user: IUser) => void,
	onChooseReceiverFail?: () => void
}

const ChooseReceiverMenu = ({ user, onChooseReceiver, onChooseReceiverFail }: Props) => {


	const userWritten = useRef<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [users, setUsers] = useState<IUser[]>([]);
	const [visibleUsers, setVisibleUsers] = useState<IUser[]>([]);
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const [btnStatus, setBtnStatus] = useState<BtnStatus>("idle")


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		userWritten.current = e.target.value;
		
		if (userWritten.current.trim().length == 0) {
			setVisibleUsers(users);
			return ;
		}
		const returnedItems: IUser[] = users.filter(user => (
			user.pseudo?.toLocaleLowerCase().search(userWritten.current.trim().toLowerCase()) !== -1
		))
		setVisibleUsers(returnedItems);
	}

	
	const printAboutUsers = () => {
		return (
			<div className="chooseReceiver-users-container">
				<div className="chooseReceiver-users-child">
					{ visibleUsers?.map((visibleUser, i) => (
						<div key={i} className="userbtn-container">
							<button onClick={() => {
								if (onChooseReceiver)
									onChooseReceiver(visibleUser)
							}} className="userbtn button_without_style">
								<Avatar srcImg={visibleUser.avatar} />
								<p className="userbtn-text">{visibleUser.pseudo}</p>
							</button>
						</div>
					)) }
				</div>
			</div>
		)
	}







	useEffect(() => {
		// console.log("did mount");
		(async () => {
			try {
				if (user?.pseudo) {
					// console.log("avant le fetch")
					const { users: usersRes }: {users: IUser[]} = await ClientApi.get(API_USER_ALL)
					if (!usersRes)
						throw new Error("salut cv ?")
					const users = usersRes.filter((userRes: IUser) => userRes.pseudo !== user.pseudo)
					// console.log("apres le fetch")
					// console.log("users = ", users)
					setUsers(users);
					setVisibleUsers(users);
				}
			} catch (err) {
				// console.log("err = ", err);
				setUsers([{
					pseudo: "bonsoir"
				},
				{
					pseudo: "bsrtgb"
				},
				{
					pseudo: "opseptg"
				},
				{
					pseudo: "srtgbgrb"
				},
				{
					pseudo: "esgvr"
				},
				{
					pseudo: "srtgbtj"
				},
				{
					pseudo: "qwdeac"
				},
				{
					pseudo: "segvgdtyrj"
				},
				{
					pseudo: "ergvwewafversgv"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
				{
					pseudo: "wwwwwwwwwwwwwwwwwwww"
				},
				{
					pseudo: "12345678901234567890"
				},
			])
			setVisibleUsers(users);
			}
		})()
	}, [user])







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
