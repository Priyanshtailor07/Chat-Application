import mongoose from "mongoose";
import { authPlugin } from "./plugins/auth.plugin.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
        default: ""// i am going to add it
    },
    bio: {
        type: String,
        default: "Hey I am using "
    },

    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    friendRequestsSent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    friendRequestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }]
}, { timestamps: true }
);


userSchema.plugin(authPlugin);

export const User = mongoose.model("User", userSchema)
