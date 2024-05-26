import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../store/useConversation";

import { decrypt } from "../utils/blockCipher";

import notificationSound from "../assets/sounds/notification.mp3";
import useE2EE from "./useE2EE";

const useListenMessages = () => {
	const { socket, sharedSecret } = useSocketContext();
	const { messages, setMessages } = useConversation();
  const { e2eeDecrypt } = useE2EE();

	useEffect(() => {
		socket?.on("newMessage", async (encrypted) => {
			const decrypted = await decrypt(encrypted, sharedSecret);
			const { newMessage } = JSON.parse(decrypted);
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

      const e2eeDecryptedMessage = {
        ...newMessage,
        receiverMessage: e2eeDecrypt(newMessage.receiverMessage),
        senderMessage: e2eeDecrypt(newMessage.receiverMessage)
      }

			setMessages([...messages, e2eeDecryptedMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, sharedSecret, setMessages, messages]);
};
export default useListenMessages;
