import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../store/useConversation";

import { decrypt } from "../utils/blockCipher";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket, sharedSecret } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", async (encrypted) => {
			const decrypted = await decrypt(encrypted, sharedSecret);
			const { newMessage } = JSON.parse(decrypted);
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, sharedSecret, setMessages, messages]);
};
export default useListenMessages;
