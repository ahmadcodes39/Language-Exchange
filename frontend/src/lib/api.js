import toast from "react-hot-toast";
import { axiosInstance } from "./axios";

export const signUp = async (formData) => {
  const response = await axiosInstance.post("/auth/signup", formData);
  return response.data;
};

export const login = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    // console.log(res.data)
    return res.data;
  } catch (error) {
    toast.error("Error in Logging out", error);
    return null;
  }
};

export const completeOnBoarding = async (formData) => {
  const res = await axiosInstance.post("/auth/onBoarding", formData);
  return res.data;
};

export const getFriends = async () => {
  const res = await axiosInstance.get("/user/friends");
  // console.log("GET /user/friends response:", res.data);
  return Array.isArray(res.data) ? res.data : [];
};

export const getRecommendedFriends = async () => {
  const res = await axiosInstance.get("/user");
  // console.log("Recommended friends response:", res.data);
  return res.data.recomemdedUser || []; // Return the array directly
};

export const getOutgoingFriendRequests = async () => {
  const res = await axiosInstance.get("/user/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/user/friend-request/${userId}`);
  return res.data;
};

export const acceptFriendRequests = async (friendId) => { //
  const res = await axiosInstance.put(`/user/friend-request/${friendId}/accept`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/user/friend-requests");
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token");
  //  console.log("Stream token response:", res.data);
  return res.data;
};
