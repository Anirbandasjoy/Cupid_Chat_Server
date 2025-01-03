import { io } from "@/app";
import { createError } from "@/config";
import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { successResponse } from "@/utils/response";
import { Response, Request, NextFunction } from "express";

export const addMessageToChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, sender, content } = req.body;

    const newMessage = await Message.create({
      chat: chatId,
      sender,
      content,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: newMessage._id }, latestMessage: newMessage._id },
      { new: true }
    ).populate("participants", "email onlineStatus");

    if (!updatedChat) {
      return next(createError(404, "Chat not found"));
    }

    io.emit("receive_message", {
      chatId: updatedChat._id,
      message: newMessage,
    });

    successResponse(res, {
      message: "Message added to chat successfully.",
      payload: { chat: updatedChat, message: newMessage },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
