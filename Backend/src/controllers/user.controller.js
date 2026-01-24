import { User } from "../models/users.models.js";

// Search users by username or email
export const searchUsers = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Search for users where username or email matches the search query (case-insensitive)
        const users = await User.find({
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ],
            _id: { $ne: req.user._id } // Exclude current user
        }).select("_id username email avatar"); // Select only necessary fields

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
