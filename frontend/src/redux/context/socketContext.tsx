import { Socket } from "socket.io-client";

export interface ISocketContextState {
	socket?: Socket,
	uid?: string,
	usersid?: string[]
}

export const defaultSocketContextState: ISocketContextState = {

}

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_usersid' | 'remove_user'

export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextActions {
	type: TSocketContextActions,
	payload: TSocketContextPayload
}

// export 