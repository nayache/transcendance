import { useEffect, useRef } from "react"
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client"
import ClientApi from "../components/ClientApi.class";
import { API_SOCKET_URL } from "../constants/RoutesApi";


const socket = io(API_SOCKET_URL, {
	auth: {
		token: `Bearer ${ClientApi.token}`
	}
})

export const useSocket = () => {

	useEffect(() => {
		return () => {
			// check before the socket changes (not the 1st render)
			// and when the component will unmount, if the socket is opened and close it if it is
			if (socket) {
				console.log("socket about to close")
				socket.close()
			}
		}
	}, [socket])

	return socket;
}