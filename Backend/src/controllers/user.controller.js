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

        const friendsSet = new Set((req.user.friends || []).map((id) => id.toString()));
        const sentSet = new Set((req.user.friendRequestsSent || []).map((id) => id.toString()));
        const receivedSet = new Set((req.user.friendRequestsReceived || []).map((id) => id.toString()));

        const results = users.map((u) => ({
            _id: u._id,
            username: u.username,
            email: u.email,
            avatar: u.avatar,
            isFriend: friendsSet.has(u._id.toString()),
            requestSent: sentSet.has(u._id.toString()),
            requestReceived: receivedSet.has(u._id.toString())
        }));

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error searching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        if (userId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFriend = (req.user.friends || []).some((id) => id.toString() === userId.toString());
        if (isFriend) {
            return res.status(409).json({ message: "User is already your friend" });
        }

        const alreadySent = (req.user.friendRequestsSent || []).some((id) => id.toString() === userId.toString());
        if (alreadySent) {
            return res.status(409).json({ message: "Friend request already sent" });
        }

        const alreadyReceived = (req.user.friendRequestsReceived || []).some((id) => id.toString() === userId.toString());
        if (alreadyReceived) {
            return res.status(409).json({ message: "User already sent you a request" });
        }

        await User.updateOne(
            { _id: req.user._id },
            { $addToSet: { friendRequestsSent: userId } }
        );

        await User.updateOne(
            { _id: userId },
            { $addToSet: { friendRequestsReceived: req.user._id } }
        );

        return res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        console.error("Send Friend Request Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body; // requester id

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const isReceived = (req.user.friendRequestsReceived || []).some((id) => id.toString() === userId.toString());
        if (!isReceived) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        await User.updateOne(
            { _id: req.user._id },
            {
                $pull: { friendRequestsReceived: userId },
                $addToSet: { friends: userId }
            }
        );

        await User.updateOne(
            { _id: userId },
            {
                $pull: { friendRequestsSent: req.user._id },
                $addToSet: { friends: req.user._id }
            }
        );

        const friend = await User.findById(userId).select("_id username email avatar");

        return res.status(200).json({ message: "Friend request accepted", friend });
    } catch (error) {
        console.error("Accept Friend Request Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body; // requester id

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        await User.updateOne(
            { _id: req.user._id },
            { $pull: { friendRequestsReceived: userId } }
        );

        await User.updateOne(
            { _id: userId },
            { $pull: { friendRequestsSent: req.user._id } }
        );

        return res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.error("Reject Friend Request Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("friends", "_id username email avatar");
        return res.status(200).json(user?.friends || []);
    } catch (error) {
        console.error("Get Friends Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("friendRequestsReceived", "_id username email avatar")
            .populate("friendRequestsSent", "_id username email avatar");

        return res.status(200).json({
            received: user?.friendRequestsReceived || [],
            sent: user?.friendRequestsSent || []
        });
    } catch (error) {
        console.error("Get Friend Requests Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
