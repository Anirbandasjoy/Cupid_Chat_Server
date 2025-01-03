import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  onlineStatus: string;
  chats: Types.ObjectId[];
}
