import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../store/useConversation";

import { useSocketContext } from "../context/SocketContext";
import { decrypt } from "../utils/blockCipher";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { sharedSecret } = useSocketContext();

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
				setMessages(messages);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages, sharedSecret]);

	return { messages, loading };
};
export default useGetMessages;
