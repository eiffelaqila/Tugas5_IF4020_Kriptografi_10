import { useState } from "react";
import useConversation from "../store/useConversation";
import toast from "react-hot-toast";

import { useSocketContext } from "../context/SocketContext";
import { encrypt, decrypt } from "../utils/blockCipher";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { sharedSecret } = useSocketContext();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const encrypted = await encrypt(JSON.stringify({ message }), sharedSecret);
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

			setMessages([...messages, newMessage]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
