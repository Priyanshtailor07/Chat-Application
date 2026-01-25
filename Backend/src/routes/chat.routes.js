import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { accessChat, fetchChats } from "../controllers/chat.controller.js";

const router = Router();

router.route("/create-new-chat").post(verifyJWT, accessChat);
router.route("/get-all-chats").get(verifyJWT, fetchChats);

export default router;
