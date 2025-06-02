import express from "express";
import {
  login,
  logout,
  onBoard,
  signup,
} from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onBoarding", protectRoute, onBoard);
router.get("/me", protectRoute, async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});
export default router;
