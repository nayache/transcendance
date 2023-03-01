
export interface IMessage {
	author: string,
	color: string,
	message: string,
	channel: string
}

export interface IOldMessageChannel {
	author: string,
	color: string,
	content: string,
	created_at: string,
}