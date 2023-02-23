import { ChannelRole, Status } from "../constants/error_constants";

export interface IChannelUser {
	pseudo: string;
	role: ChannelRole;
	status: Status;
}

export interface IChannel {
	name: string;
	users: IChannelUser[];
}
