import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../store/useConversation";

import { useSocketContext } from "../context/SocketContext";
import { decrypt, encrypt } from "../utils/blockCipher";
import useE2EE from "./useE2EE";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { sharedSecret } = useSocketContext();
	const { e2eeEncrypt, e2eeDecrypt } = useE2EE();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const { senderEncrypted, receiverEncrypted } = e2eeEncrypt(message);
			const e2eeSenderEncryptedMessage = JSON.stringify(senderEncrypted);
			const e2eeReceiverEncryptedMessage = JSON.stringify(receiverEncrypted);


			const encrypted = await encrypt(
				JSON.stringify({
					senderMessage: e2eeSenderEncryptedMessage,
					receiverMessage: e2eeReceiverEncryptedMessage
				}),
				sharedSecret,
			);

			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ encrypted }),
					});
					const { encrypted: newEncryptedMessage } = await res.json();
					if (newEncryptedMessage.error) {
						throw new Error(newEncryptedMessage.error);
					}

			const decrypted = await decrypt(newEncryptedMessage, sharedSecret);
			const { newMessage } = JSON.parse(decrypted);

			setMessages([...messages, {
        ...newMessage,
        receiverMessage: e2eeDecrypt(newMessage.senderMessage),
        senderMessage: e2eeDecrypt(newMessage.senderMessage)
      }]);
		} catch (error) {
			toast.error(error.message);
			console.error(error.stack);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
