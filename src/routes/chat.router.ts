import express from "express";
import {
  createChat,
  getChatsForUser,
  getChatById,
  deleteChat,
} from "@/controllers/chat.controller";
import { isLogin } from "@/middlewares/auth.middleware";

const chatRouter = express.Router();

// Create a new chat
chatRouter.post("/create", isLogin, createChat);

// Get all chats for a specific user
chatRouter.get("/user/:userId", getChatsForUser);

chatRouter.get("/:chatId", getChatById);

// Delete a chat
chatRouter.delete("/:chatId", deleteChat);

export default chatRouter;
