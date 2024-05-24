import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getSchnorrDSGlobalPublicKey } from "../controller/schnorrDS.controller.js";

const router = express.Router();

router.get("/", protectRoute, getSchnorrDSGlobalPublicKey);

export default router;
