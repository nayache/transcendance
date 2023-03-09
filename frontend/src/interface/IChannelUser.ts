import { ChannelRole, Status } from "../constants/EMessage";
import { IOldMessageChannel } from "./IMessage";


export interface IChannelJoin {
	channel: string,
	user: IChannelUser,
}

export interface IChannelLeave {
	channel: string,
	pseudo: string,
}

export interface IChannelKick {
	channel: string,
	author: IChannelUser,
	target: string,
	action: "kick" | "ban"
}

export interface IChannelUser {
	pseudo: string;
	role: ChannelRole;
	status: Status;	
    color: string;
}

export interface IChannel {
	name: string;
	password: boolean,
	prv: boolean,
	users: IChannelUser[];
	messages: IOldMessageChannel[];
}
