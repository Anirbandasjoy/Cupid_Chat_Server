import { Types } from "mongoose";

export interface IChat {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
  latestMessage?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
