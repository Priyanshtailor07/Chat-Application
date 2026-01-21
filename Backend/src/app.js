import express from "express";
import passport from "passport";
import "./config/passport.js"; // Import passport config
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);

export { app };
