import { ChannelRole, Status } from "../constants/EMessage";
import { IOldMessageChannel } from "./IMessage";

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
