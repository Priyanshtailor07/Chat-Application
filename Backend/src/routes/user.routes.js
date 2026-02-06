import { Router } from "express";
import { acceptFriendRequest, getFriendRequests, getFriends, rejectFriendRequest, searchUsers, sendFriendRequest } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes
router.use(verifyJWT);

router.get("/search", searchUsers);
router.get("/friends", getFriends);
router.get("/requests", getFriendRequests);
router.post("/requests/send", sendFriendRequest);
router.post("/requests/accept", acceptFriendRequest);
router.post("/requests/reject", rejectFriendRequest);

export default router;
