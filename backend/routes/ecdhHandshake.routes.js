import express from "express";
import { ecdhHandshake } from "../controller/ecdhHandshake.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, ecdhHandshake);

export default router;
 