import axios from "axios";

// const BASE_URL = import.meta.env.MODE === "development"
//   ? "http://localhost:5000/api"
//   : "https://language-exchange-8zc9-backend.vercel.app/api";
const BASE_URL  = "http://localhost:5000/api"
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
