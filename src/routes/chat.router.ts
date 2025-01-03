import express from "express";
import {
  createChat,
  getChatsForUser,
  getChatById,
  deleteChat,
} from "@/controllers/chat.controller";

const chatRouter = express.Router();

// Create a new chat
chatRouter.post("/", createChat);

// Get all chats for a specific user
chatRouter.get("/user/:userId", getChatsForUser);

// Get a single chat by ID
chatRouter.get("/:chatId", getChatById);

// Delete a chat
chatRouter.delete("/:chatId", deleteChat);

export default chatRouter;
