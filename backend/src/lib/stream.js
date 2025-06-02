import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;

if (!apiKey || !apiSecret) {
  console.log("Stream API Key and Secret is missing");
}
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    // Wrap single user object in an array for upsertUsers
    const users = Array.isArray(userData) ? userData : [userData];
    await streamClient.upsertUsers(users);
    return userData;
  } catch (error) {
    console.log("Error creating the stream user:", error.message);
    throw error; // Propagate the error for the caller to handle
  }
};
// Tod : do it later
export const createStreamToken = (userId) => {
  try {
    // user id should be a string
    const userIdStr = userId.toString();
    const token = streamClient.createToken(userIdStr);
    return token;
  } catch (error) {
    console.log("Error generating Stream Token", error.message);
  }
};
