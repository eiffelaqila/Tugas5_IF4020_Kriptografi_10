import mongoose from "mongoose";

const ecdhHandshakeSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sharedSecret: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const ECDHHandshake = mongoose.model("ECDHHandshake", ecdhHandshakeSchema);

export default ECDHHandshake;
