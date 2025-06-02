import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import {
  getMyFriends,
  getRecommendedFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequest,
  getOutgoingFriendRequest
} from "../controllers/user_controller.js";

const router = express.Router();

// allow router to use protect rout for all end points
router.use(protectRoute);

router.get("/", getRecommendedFriends);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequest);
router.get("/outgoing-friend-requests", getOutgoingFriendRequest);

export default router;
