import { ChannelRole, Status } from "../constants/EMessage";
import { IOldMessageChannel } from "./IMessage";

/**
	export interface IChannelJoin {
		channel: string,
		user: IChannelUser
	}
 */

export interface IChannelJoin {
	pseudo: string,
	channel: string,
	color: string,
}

export interface IChannelLeave {
	pseudo: string,
	channel: string,
	color: null,
}

export interface IChannelUser {
	pseudo: string;
	role: ChannelRole;
	status: Status;
}

export interface IChannel {
	name: string;
	users: IChannelUser[];
	messages: IOldMessageChannel[];
}
