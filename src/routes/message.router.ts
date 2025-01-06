import { sendMessage } from "@/controllers/message.controller";
import { isLogin } from "@/middlewares/auth.middleware";
import express from "express";

const messageRouter = express.Router();

// Add a message to a chat
messageRouter.post("/send", isLogin, sendMessage);

export default messageRouter;
