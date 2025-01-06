import { IChat } from "@/types/chat.types";
import { Schema, model } from "mongoose";

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },

    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
