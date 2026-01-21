import { User } from "../models/users.models.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        return { accessToken, refreshToken }

    } catch (error) {
        throw new Error(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ([username, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            return res.status(409).json({ message: "User with email or username already exists" });
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password
        });

        const createdUser = await User.findById(user._id).select("-password -__v");

        if (!createdUser) {
            return res.status(500).json({ message: "Something went wrong while registering the user" });
        }

        return res.status(201).json({
            user: createdUser,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Username or email is required" });
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -__v");

        const options = {
            httpOnly: true,
            secure: true // Should be true in production
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged In Successfully"
            });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

const googleCallback = async (req, res) => {
    try {
        // Passport attaches the user to req.user
        const user = req.user;

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        // Redirect to client application with tokens or set cookies
        // For simplicity, we'll set cookies and redirect to a success page or client home
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            // Redirect to frontend. Replace with actual frontend URL.
            .redirect("http://localhost:5173/");

    } catch (error) {
        console.error("Google Callback Error:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};


export { registerUser, loginUser, googleCallback };
