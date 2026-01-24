import { Chat } from "../models/chat.models.js";
import { User } from "../models/users.models.js";

// @description     Create or fetch One to One Chat
// @route           POST /api/chats/
// @access          Protected
export const accessChat = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        console.log("Email param not sent with request");
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Find the user by email
        const targetUser = await User.findOne({ email });

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is trying to chat with themselves
        if (targetUser._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Cannot create chat with yourself" });
        }

        // Check if chat already exists
        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { participants: { $elemMatch: { $eq: req.user._id } } },
                { participants: { $elemMatch: { $eq: targetUser._id } } },
            ],
        })
            .populate("participants", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "username email avatar",
        });

        if (isChat.length > 0) {
            res.status(200).json(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                participants: [req.user._id, targetUser._id],
            };

            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "participants",
                "-password"
            );
            res.status(200).json(FullChat);
        }
    } catch (error) {
        console.error("Access Chat Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// @description     Fetch all chats for a user
// @route           GET /api/chats/
// @access          Protected
export const fetchChats = async (req, res) => {
    try {
        const results = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "username email avatar",
        });

        res.status(200).json(populatedResults);
    } catch (error) {
        console.error("Fetch Chats Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
