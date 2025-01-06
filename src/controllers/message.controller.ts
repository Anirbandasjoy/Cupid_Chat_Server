import { io } from "@/app";
import { createError } from "@/config";
import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { successResponse } from "@/utils/response";
import { Response, Request, NextFunction } from "express";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, chatId } = req.body;
    const senderId = req.user._id;

    if (!content || !chatId) {
      return next(createError(400, "Content and chatId are required"));
    }

    // Find chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(createError(404, "Chat not found"));
    }

    // Create new message
    const newMessage = await Message.create({
      sender: senderId,
      content,
      chat: chatId,
    });

    // Push the new message to chat
    chat.messages.push(newMessage._id);
    chat.latestMessage = newMessage._id;
    await chat.save();

    // Emit message to participants (using socket.io for real-time)
    chat.participants.forEach((participantId: any) => {
      // Emit message to all participants of the chat
      io.to(participantId).emit("message_received", newMessage);
    });

    // Send success response
    successResponse(res, {
      message: "Message sent successfully",
      payload: newMessage,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
