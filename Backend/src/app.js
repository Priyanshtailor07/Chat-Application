import express from "express";
import passport from "passport";
import "./config/passport.js"; // Import passport config
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

import session from "express-session";

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // Set to true only in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

export { app };
