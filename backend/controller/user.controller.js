import User from "../models/user.model.js";

import { getSharedSecret } from "./ecdhHandshake.controller.js";
import { encrypt } from "../utils/blockCipher.js"

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		const sharedSecret = await getSharedSecret(loggedInUserId);
		const encrypted = await encrypt(JSON.stringify({ users: filteredUsers }), sharedSecret);

		res.status(200).json({
			encrypted,
		});
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
