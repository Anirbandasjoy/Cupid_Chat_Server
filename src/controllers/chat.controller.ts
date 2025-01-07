import { io } from "@/app";
import { createError } from "@/config";
import Chat from "@/models/chat.model";
import User from "@/models/user.model";
import { errorResponse, successResponse } from "@/utils/response";
import { Response, Request, NextFunction } from "express";

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = req.user?._id;
    const { receiverId } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return next(createError(404, "Receiver not found"));
    }

    if (senderId.toString() === receiverId.toString()) {
      return next(createError(400, "You cannot chat with yourself"));
    }

    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      errorResponse(res, {
        statusCode: 400,
        message: "A one-to-one chat already exists between these users.",
        payload: { chatId: existingChat?._id },
      });
    }

    const newChat = await Chat.create({
      participants: [senderId, receiverId],
      isGroupChat: false,
    });

    io.emit("new_chat", newChat);
    io.to(senderId.toString()).emit("new_chat", newChat);
    io.to(receiverId.toString()).emit("new_chat", newChat);

    // Return success response
    successResponse(res, {
      statusCode: 201,
      message: "Chat created successfully.",
      payload: newChat,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to your error-handling middleware
  }
};

export const getChatsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "email onlineStatus")
      .populate("latestMessage");

    successResponse(res, {
      message: "Chats fetched successfully.",
      payload: chats,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getChatById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatId = req.params.chatId;

    const chat = await Chat.findById(chatId)
      .populate("participants", "email onlineStatus")
      .populate({
        path: "messages",
        populate: { path: "sender", select: "email" },
      });

    if (!chat) {
      return next(createError(400, "Chat not found."));
    }

    successResponse(res, {
      message: "Returned Chats",
      payload: chat,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatId = req.params.chatId;

    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return next(createError(400, "Chat not found."));
    }

    successResponse(res, {
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
