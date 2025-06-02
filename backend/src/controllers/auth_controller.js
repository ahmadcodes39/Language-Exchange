import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream.js";
dotenv.config();
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use different one" });
    }
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}`;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User({
      name,
      email,
      password: hashedPassword,
      profilePicture: randomAvatar,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    await newUser.save();
    // creating stream user
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.name,
        image: newUser.profilePicture,
      });
      console.log(`Stream user created for ${newUser.name}`);
    } catch (error) {
      console.log("Error creating stream user", error.message);
    }
    res.cookie("Jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // prevent xss attacks
      sameSite: "strict", // prevent csrf attacks
      secure: process.env.NODE_ENV === "production", // only send cookie over https in production
    });

    res.status(201).json({ success: true, usre: newUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("Jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // HTTPS in production
    });

    // Send success response
    res.status(200).json({ success: true, user: findUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("Jwt");
  res.status(200).json({ message: "Logged out successfully" });
};

export const onBoard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, Bio, nativeLanguage, learningLanguage, location } = req.body;
    if (!name || !Bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "Please fill all fields",
        missingFields: [
          !name && "name",
          !Bio && "Bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body, // Use the entire request body
        isOnboarded: true,
      },
      { new: true }
    );

    try {
        await upsertStreamUser({
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          image: updatedUser.profilePicture || "",
        });
        console.log("Stream user updated successfully");
    } catch (error) {
        console.log(`Error while updating the stream user`, error.message);
    }
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User onboarded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Onboard error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
