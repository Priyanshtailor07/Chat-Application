import { Router } from "express";
import { registerUser, loginUser, googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleCallback
);

export default router;
