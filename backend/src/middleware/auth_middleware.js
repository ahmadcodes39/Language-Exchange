import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.Jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Token not provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    req.user = user;
    next(); // it measn that after all above process run the next function which is onBoard in this case
  } catch (error) {
    console.log("Error in auth middleware", error.message);
    return res.status(500).json({ message: "Internal server error " });
  }
};
