import { useState } from "react";
import toast from "react-hot-toast";

import { useSocketContext } from "../context/SocketContext";
import { decrypt } from "../utils/blockCipher";
import SchnorrDS from "../utils/schnorrDS";

const useDownloadSchnorrDS = () => {
	const [loading, setLoading] = useState(false);
	const { sharedSecret } = useSocketContext();

	const handleDownloadKeyPair = async () => {
		setLoading(true);
		try {
			const schnorrDS = new SchnorrDS();
			const res = await fetch("/api/schnorrds");
			const { encrypted } = await res.json();
			if (encrypted.error) {
				throw new Error(encrypted.error);
			}

			const decrypted = await decrypt(encrypted, sharedSecret);
			const { p, q, a } = JSON.parse(decrypted);

			const{ s, v } = schnorrDS.generateKeyPair(BigInt(p), BigInt(q), BigInt(a));
			const privateKeyBlob = schnorrDS.getDownloadablePrivateKey(s);
			const publicKeyBlob = schnorrDS.getDownloadablePublicKey(v);

			let link = document.createElement('a')
			link.href = URL.createObjectURL(privateKeyBlob);
			link.download = 'privateKey.scprv';
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			link = document.createElement('a')
			link.href = URL.createObjectURL(publicKeyBlob);
			link.download = 'publicKey.scpub';
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { handleDownloadKeyPair, loading };
};
export default useDownloadSchnorrDS;
