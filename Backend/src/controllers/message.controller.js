import { Message } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";

// @description     Create a new message
// @route           POST /api/messages
// @access          Protected
export const sendMessage = async (req, res) => {
    const { chatId, content, type, fileUrl } = req.body;

    if (!chatId) {
        return res.status(400).json({ message: "chatId is required" });
    }

    if (!content && !fileUrl) {
        return res.status(400).json({ message: "Message content is required" });
    }

    try {
        const chat = await Chat.findOne({
            _id: chatId,
            participants: { $elemMatch: { $eq: req.user._id } }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const message = await Message.create({
            sender: req.user._id,
            chat: chatId,
            content,
            type: type || "text",
            fileUrl
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id }, { new: true });

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "username email avatar")
            .populate("chat");

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// @description     Fetch all messages for a chat
// @route           GET /api/messages/:chatId
// @access          Protected
export const fetchMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findOne({
            _id: chatId,
            participants: { $elemMatch: { $eq: req.user._id } }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "username email avatar")
            .sort({ createdAt: 1 });

        await Message.updateMany(
            {
                chat: chatId,
                sender: { $ne: req.user._id },
                readBy: { $ne: req.user._id }
            },
            {
                $addToSet: { readBy: req.user._id },
                $set: { status: "delivered" }
            }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error("Fetch Messages Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// @description     Mark chat messages as read
// @route           PATCH /api/messages/:chatId/read
// @access          Protected
export const markMessagesRead = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findOne({
            _id: chatId,
            participants: { $elemMatch: { $eq: req.user._id } }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const result = await Message.updateMany(
            {
                chat: chatId,
                sender: { $ne: req.user._id },
                readBy: { $ne: req.user._id }
            },
            {
                $addToSet: { readBy: req.user._id },
                $set: { status: "delivered" }
            }
        );

        res.status(200).json({ updated: result.modifiedCount || 0 });
    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
