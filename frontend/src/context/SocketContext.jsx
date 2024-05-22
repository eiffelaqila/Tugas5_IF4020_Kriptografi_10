import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

import ECDH from "../utils/ecdh";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [sharedSecret, setSharedSecret] = useState(null);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const clientECDH = new ECDH("secp128r1");
			const socket = io("http://localhost:5000", {
				query: {
					userId: authUser._id,
					clientPublicKey: JSON.stringify(clientECDH.publicKey),
				},
			});

			setSocket(socket);

			socket.on("serverPublicKey", (serverPublicKey) => {
				const sharedSecret = clientECDH.computeSharedSecret(JSON.parse(serverPublicKey));
				setSharedSecret(sharedSecret);
			});

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
			if (sharedSecret) {
				setSharedSecret(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers, sharedSecret }}>{children}</SocketContext.Provider>;
};
