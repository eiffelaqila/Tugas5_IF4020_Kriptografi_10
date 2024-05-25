import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../store/useConversation";

import { useSocketContext } from "../context/SocketContext";
import { decrypt } from "../utils/blockCipher";
import useE2EE from "./useE2EE";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { sharedSecret } = useSocketContext();
  const { e2eeDecrypt } = useE2EE();

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
            message: e2eeDecrypt(message.message)
          }
        })
        console.log('messages:', messages);
        console.log('e2eeDecryptedMessage:', e2eeDecryptedMessage)

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
