import { useEffect, useRef } from "react"
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client"

export const useSocket = (
	uri: string | Partial<ManagerOptions & SocketOptions>,
	opts?: Partial<ManagerOptions & SocketOptions> | undefined
) => {
	const socketRef = useRef<Socket>();
	socketRef.current = io(uri, opts)

	useEffect(() => {
		return () => {
			// check before the socketRef.current changes (not the 1st render)
			// and when the component will unmount, if the socketRef.current is opened and close it if it is
			if (socketRef.current)
				socketRef.current.close()
		}
	}, [socketRef.current])

	return socketRef.current;
}