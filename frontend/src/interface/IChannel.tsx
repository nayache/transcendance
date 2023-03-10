import { ChannelRole, Status } from "../constants/EMessage";
import { IOldMessageChannel } from "./IMessage";


export interface IChannelUser {
	pseudo: string;
	role: ChannelRole;
	status: Status;
    color: string;
}

export interface IChannelEvJoin {
	channel: string,
	user: IChannelUser,
}

export interface IChannelEvLeave {
	channel: string,
	pseudo: string,
}

export interface IChannelEvPunish {
	channel: string,
	author: IChannelUser,
	target: string,
	action: "kick" | "ban"
}

export interface IChannelEvMute {
	channel: string,
	author: IChannelUser,
	target: IChannelUser,
	expiration: Date
}

export interface IChannelEvSetAdmin {
	channel: string,
	author: IChannelUser,
	target: IChannelUser
}

export interface IChannelEvRoomAccess {
	channel: string,
	action: "password" | "prv",
	enabled: boolean
}

export interface IChannel {
	name: string;
	password: boolean,
	prv: boolean,
	users: IChannelUser[];
	messages: IOldMessageChannel[];
}
