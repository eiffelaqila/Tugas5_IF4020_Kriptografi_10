import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

import ECDH from "../utils/ecdh";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username) => {
		const success = handleInputErrors(username);
		if (!success) return;
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);

			await ecdhHandshake();
		} catch (error) {
			toast.error(error.message);
			console.log(error.stack);
		} finally {
			setLoading(false);
		}
	};

	const ecdhHandshake = async () => {
		const clientECDH = new ECDH("secp256r1");
		console.log(clientECDH);

		const res = await fetch('/api/ecdhHandshake', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ clientPublicKey: JSON.stringify(clientECDH.publicKey) }),
		});
		const data = await res.json();
		if (data.error) throw new Error(data.error);

		console.log(data);
		const { serverPublicKey } = data;

		const sharedSecret = clientECDH.computeSharedSecret(JSON.parse(serverPublicKey));
		console.log("DEBUG: Shared secret:", sharedSecret.toString());
	}

	return { loading, login };
};
export default useLogin;

function handleInputErrors(username) {
	if (!username) {
		toast.error("Please fill username field")
		return false;
	}

	return true;
}
