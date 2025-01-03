import { addMessageToChat } from "@/controllers/message.controller";
import express from "express";

const messageRouter = express.Router();

// Add a message to a chat
messageRouter.post("/add", addMessageToChat);

export default messageRouter;
