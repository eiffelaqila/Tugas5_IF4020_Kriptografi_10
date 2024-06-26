import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { generatePublicKey, generateRandomPrivateKey } from "../utils/ecc";

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

      const privateKey = generateRandomPrivateKey(16);
      const publicKey = generatePublicKey(privateKey)
      localStorage.setItem("v", JSON.stringify(privateKey));
      localStorage.setItem("b", JSON.stringify(publicKey));

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

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
