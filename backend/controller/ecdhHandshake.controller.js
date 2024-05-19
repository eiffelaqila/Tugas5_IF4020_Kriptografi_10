import ECDH from "../utils/ecdh.js";
import ECDHHandshake from "../models/ecdhHandshake.model.js";

export const ecdhHandshake = async (req, res) => {
	try {
		const { clientPublicKey } = req.body;
    const userId = req.user._id;

    const serverECDH = new ECDH("secp256r1");

    const sharedSecret = serverECDH.computeSharedSecret(JSON.parse(clientPublicKey));
    console.log("DEBUG: Shared secret:", sharedSecret.toString());
    await ECDHHandshake.findOneAndUpdate(
      { userId },
      { userId, sharedSecret },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

		res.status(200).json({
			serverPublicKey: JSON.stringify(serverECDH.publicKey),
		});
	} catch (error) {
		console.log("Error in ECDH handshake controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
