import { createStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = createStreamToken(req.user._id);
    return res.status(200).json({ token });

  } catch (error) {
    console.log("Error generating Stream Token", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
