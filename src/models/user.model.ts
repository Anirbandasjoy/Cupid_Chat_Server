import { IUser } from "@/types/user.types";
import { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required field"],
      unique: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    onlineStatus: {
      type: String,
      enum: ["Online", "Offline", "Busy"],
      default: "Offline",
    },
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },

  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
