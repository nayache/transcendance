import { IChannelMessage, IOldChannelMessage } from "../interface/IChannelMessage";



/* return the old number of messages */
export const resetMessagesBlock = (messages: IOldChannelMessage[]): JSX.Element[] => {
	const formattedMessages: JSX.Element[] = messages.map((oldMessage: IOldChannelMessage, i) => (
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



export const addMessageBlock = ({author, message, color}: IChannelMessage): JSX.Element => {
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

export const getSecondsRemainingMute = (expiration: Date): number => {
	return Math.round((expiration.getTime() - new Date().getTime()) / 1000)
}

export const addMessageBlockUserMute = (target: string, expiration: Date) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					You just muted {target} {getSecondsRemainingMute(expiration)}sec
				</i>
			</p>
		</div>
	)
	return newMessage;
}

export const addMessageBlockUserMuted = (author: string, expiration: Date) => {
	const newMessage = (
		<div className="event-text-container">
			<p className="event-text">
				<i>
					{author} muted you {getSecondsRemainingMute(expiration)}sec
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