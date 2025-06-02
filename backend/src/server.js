import express from "express";
import dotenv from "dotenv";
import auth_routes from "./routes/auth_routes.js";
import user_routes from "./routes/user_routes.js";
import connectDb from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import chat_routes from "./routes/chat_routes.js";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
})); 
app.use('/api/auth', auth_routes);
app.use('/api/user', user_routes);
app.use('/api/chat', chat_routes);

if (process.env.NODE_ENV ==="production") {
  app.use(express.static(path.join(__dirname,"../frontend/dist"))); // we are telling express to serve static files from the frontend build directory
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => { 
  console.log("Server is running on port", PORT);
  connectDb().catch(err => console.error("Database connection error:", err));
});