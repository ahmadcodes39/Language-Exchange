import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    Bio: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location:{
        type:String,
        default:""
    },
    profilePicture: {
      type: String,
      default:"",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
