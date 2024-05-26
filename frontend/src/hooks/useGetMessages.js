import { useEffect, useState } from "react";
import useConversation from "../store/useConversation";

import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { decrypt } from "../utils/blockCipher";
import useE2EE from "./useE2EE";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { authUser } = useAuthContext();
	const { messages, setMessages, selectedConversation } = useConversation();
	const { sharedSecret } = useSocketContext();
	const { e2eeDecrypt } = useE2EE();

	const isMessageSentByUser = (message) => message.senderId === authUser._id;

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const { encrypted } = await res.json();
				if (encrypted.error) {
					throw new Error(encrypted.error);
				}

				const decrypted = await decrypt(encrypted, sharedSecret);
				const { messages } = JSON.parse(decrypted);

        // e2ee decrypt here
        const e2eeDecryptedMessage = messages.map((message) => {
          return {
            ...message,
            receiverMessage: isMessageSentByUser(message) ? e2eeDecrypt(message.senderMessage) : e2eeDecrypt(message.receiverMessage),
            senderMessage: isMessageSentByUser(message) ? e2eeDecrypt(message.senderMessage) : e2eeDecrypt(message.receiverMessage),
          }
        })

        // setMessages(messages);
				setMessages(e2eeDecryptedMessage);
			} catch (error) {
				// toast.error(error.message);
        console.error(error.stack);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages, sharedSecret]);

	return { messages, loading };
};
export default useGetMessages;
