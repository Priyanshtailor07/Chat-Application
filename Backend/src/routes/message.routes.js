import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fetchMessages, markMessagesRead, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/").post(verifyJWT, sendMessage);
router.route("/:chatId").get(verifyJWT, fetchMessages);
router.route("/:chatId/read").patch(verifyJWT, markMessagesRead);

export default router;
