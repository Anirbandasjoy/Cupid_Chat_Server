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
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: function (this: any) {
        return this.isGroupChat;
      },
    },
    groupAvatar: {
      type: String,
      default:
        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
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
