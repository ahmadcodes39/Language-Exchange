import mongo from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDb = async () => {
  try {
    const conn = await mongo.connect(process.env.MONGO_URI);
    console.log(
      "connected to Mongo",
      conn.connection.host,
      conn.connection.port
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDb;
