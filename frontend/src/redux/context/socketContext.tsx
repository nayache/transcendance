import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketState {
	socket?: Socket,
	uid?: string,
	usersid?: string[]
}

const initialState: SocketState = {

}

const SocketSlice = createSlice({
	name: "socket",
	initialState,
	reducers: {
		updateSocket: (state, action) => {

		},
		updateUid: (state, action) => {

		},
		updateUsers: (state, action) => {

		},
		removeUser: (state, action) => {

		},
	}
})

const SocketReducer = SocketSlice.reducer
export default SocketReducer;