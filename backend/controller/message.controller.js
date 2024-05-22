import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

import { getSharedSecret } from "./ecdhHandshake.controller.js";
import { encrypt, decrypt } from "../utils/blockCipher.js"

export const sendMessage = async (req, res) => {
	try {
		const { encrypted: encryptedMessage } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const sharedSecret = await getSharedSecret(senderId);
		const decryptedMessage = await decrypt(encryptedMessage, sharedSecret);
		const { message } = JSON.parse(decryptedMessage);

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			const sharedSecret = await getSharedSecret(receiverId);
			const encryptedNewMessage = await encrypt(JSON.stringify({ newMessage }), sharedSecret);

			io.to(receiverSocketId).emit("newMessage", encryptedNewMessage);
		}

		const encryptedNewMessage = await encrypt(JSON.stringify({ newMessage }), sharedSecret);

		res.status(201).json({ encrypted: encryptedNewMessage });
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) {
			const sharedSecret = await getSharedSecret(senderId);
			const encrypted = await encrypt(JSON.stringify({ messages: [] }), sharedSecret)
			return res.status(200).json({
				encrypted,
			})
		};

		const messages = conversation.messages;

		const sharedSecret = await getSharedSecret(senderId);
		const encrypted = await encrypt(JSON.stringify({ messages }), sharedSecret);

		res.status(200).json({ 
			encrypted,
		});
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
