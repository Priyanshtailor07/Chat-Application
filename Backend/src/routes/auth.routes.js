import { Router } from "express";
import { registerUser, loginUser, googleCallback, getCurrentUser } from "../controllers/auth.controller.js";
import passport from "passport";

const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleCallback
);

router.get("/me", verifyJWT, getCurrentUser);

export default router;
