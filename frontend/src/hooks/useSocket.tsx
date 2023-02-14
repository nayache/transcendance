import { useEffect, useRef } from "react"
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client"

export const useSocket = (
	uri: string | Partial<ManagerOptions & SocketOptions>,
	opts?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {
	const { current: socket } = useRef(io(uri, opts))

	useEffect(() => {
		return () => {
			if (socket) // if it's opened
				socket.close()
		}
	}, [socket])

	return socket;
}