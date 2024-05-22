import ECDHHandshake from "../models/ecdhHandshake.model.js";

export const getSharedSecret = async (userId) => {
	try {
		const ecdhHandshake = await ECDHHandshake.findOne({ userId });
		return ecdhHandshake.sharedSecret;
	} catch (error) {
		console.error("Error in getSharedSecret: ", error.message);
		return Promise.reject(new Error(error));
	}
};
