import express from "express";
import http from "http";
import { Server } from "socket.io";

import ECDHHandshake from "../models/ecdhHandshake.model.js";
import ECDH from "../utils/ecdh.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: [
      "http://localhost:3000", "http://localhost:4000",
      "http://127.0.0.1:3000", "http://127.0.0.1:4000"
    ],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}
ECDHHandshake.deleteMany()
	.then(() => { console.log("Deleting ECDH handshake data...") })

io.on("connection", async (socket) => {
	console.log("a user connected", socket.id);

	const { userId, clientPublicKey } = socket.handshake.query;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	const serverECDH = new ECDH("secp128r1");
	socket.emit('serverPublicKey', JSON.stringify(serverECDH.publicKey));
	console.log("Sending server public key");

	const sharedSecret = serverECDH.computeSharedSecret(JSON.parse(clientPublicKey));
	await ECDHHandshake.findOneAndUpdate(
		{ userId },
		{ userId, sharedSecret },
		{ upsert: true, new: true, setDefaultOnInsert: true },
	);

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", async () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));

		await ECDHHandshake.findOneAndDelete({ userId })
	});
});

export { app, io, server };
