import { IMessage, IOldMessageChannel } from "../interface/IMessage";

/* return the old number of messages */
export const resetMessagesBlock = (messages: IOldMessageChannel[]): JSX.Element[] => {
	const formattedMessages: JSX.Element[] = messages.map((oldMessage: IOldMessageChannel, i) => (
		<div key={i} className="message-container without-animation">
			<p className="message-text">
				<b className="other_pseudo" style={{color: oldMessage.color}}>
					{oldMessage.author}
				</b>
				: {oldMessage.content}
			</p>
		</div>
	))
	return formattedMessages;
}



export const addMessageBlock = ({author, message, color}: IMessage): JSX.Element => {
	const newMessage = (
		<div className="message-container">
			<p className="message-text">
				<b className="other_pseudo" style={{color}}>
					{author}
				</b>
				: {message}
			</p>
		</div>
	)
	return newMessage
}

export const addMessageBlockUserJoin = (author: string): JSX.Element => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} joined the channel
				</i>
			</p>
		</div>
	)
	return newMessage
}

export const addMessageBlockUserLeave = (author: string) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} left the channel
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserKick = (author: string, target: string) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} kicked {target} from the channel
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserBan = (author: string, target: string) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} banned {target} from the channel
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserMute = (target: string, duration: Date) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					You just muted {target} during {duration.getSeconds()}sec
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserMuted = (author: string, duration: Date) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} muted you during {duration.getSeconds()}sec
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserGetAdmin = (author: string) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} just promoted you to admin
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserSetAdmin = (target: string) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					You just promoted {target} to admin
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserSetAdminInfo = (author: string, target: string) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} just promoted {target} to admin
				</i>
			</p>
		</div>
	)
	return newMessage;
}