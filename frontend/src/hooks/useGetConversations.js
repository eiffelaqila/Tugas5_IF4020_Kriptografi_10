import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useSocketContext } from "../context/SocketContext";
import { decrypt } from "../utils/blockCipher";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const { sharedSecret } = useSocketContext();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users");
				const { encrypted } = await res.json();
				if (encrypted.error) {
					throw new Error(encrypted.error);
				}

				const decrypted = await decrypt(encrypted, sharedSecret);
				const { users } = JSON.parse(decrypted);
				setConversations(users);
			} catch (error) {
				toast.error(error.stack);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, [sharedSecret]);

	return { loading, conversations };
};
export default useGetConversations;
