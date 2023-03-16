
export interface IChannelMessage {
	author: string,
	color: string,
	message: string,
	channel: string
}

export interface IOldChannelMessage {
	author: string,
	color: string,
	content: string,
	created_at: string,
}
