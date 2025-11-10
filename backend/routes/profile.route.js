import express from "express";
import {
	UserInfoController 
} from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.put('/update', verifyToken, UserInfoController.update);

export default router;
