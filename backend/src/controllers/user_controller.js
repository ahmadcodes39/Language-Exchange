import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "name profilePicture learningLanguage nativeLanguage");
      const friends = user.friends.reverse()
    res.status(200).json(friends);
  } catch (error) {
    console.log("Error fetching my Friends", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRecommendedFriends = async (req, res) => {
  try {
    const currentUser = req.user;
    const currentUserId = currentUser._id;
    const recomemdedUser = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exceluding the curernt user
        { _id: { $nin: currentUser.friends } }, // exceluding the friends of the current user
        { isOnboarded: true },
      ],
    });

    return res.status(200).json({ recomemdedUser });
  } catch (error) {
    console.log("Error fetching recomemded user", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: recipentId } = req.params;

    // prevent sending request to my self
    if (myId == recipentId) {
      return res.status(400).json({
        message: "You cannot send friend request to yourself",
      });
    }
    // check if recipent exist
    const recipent = await User.findById(recipentId);
    if (!recipent) {
      return res.status(400).json({ message: "Recipent not exist" });
    }

    // check if user is already friends
    if (recipent.friends.includes(myId)) {
      return res.status(400).json({
        message: "You are already friends",
      });
    }

    // check if request already exist
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipentId },
        { sender: recipentId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }

    // finally send friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipentId,
    });

    return res.status(200).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    console.log("Error sending friend request", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    // 1. Find the friend request
    const findRequest = await FriendRequest.findById(requestId);
    if (!findRequest) {
      return res.status(400).json({
        message: "Friend request not found",
      });
    }

    // 2. Validate the correct user is accepting it
    if (findRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to accept this friend request",
      });
    }

    // 3. Update the request status
    findRequest.status = "accepted";
    await findRequest.save();

    // 4. Add each other to friends list (avoid duplicates with $addToSet)
    const senderId = findRequest.sender;
    const recipientId = findRequest.recipient;

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: recipientId },
    });
    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friends: senderId },
    });

    // ✅ 5. Send back a response
    return res.status(200).json({
      message: "Friend request accepted",
    });

  } catch (error) {
    console.log("Error accepting friend request", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const incommingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name profilePicture learningLanguage nativeLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("recipient", "name profilePicture");

    return res.status(200).json({
      incommingRequests,
      acceptedRequests,
    });
  } catch (error) {
    console.log("Error getting friend request", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const outGoingRequests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate("recipient", "name profilePicture learningLanguage nativeLanguage");

    return res.status(200).json({
      outGoingRequests,
    });
  } catch (error) {
    console.log("Error getting outgoing friend request", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
