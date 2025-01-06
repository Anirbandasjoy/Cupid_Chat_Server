import { io } from "@/app";
import { createError } from "@/config";
import Chat from "@/models/chat.model";
import { successResponse } from "@/utils/response";
import { Response, Request, NextFunction } from "express";

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
      return next(
        createError(
          400,
          "Only two participants are allowed for one-to-one chat."
        )
      );
    }

    const existingChat = await Chat.findOne({
      participants: { $all: participants },
    });

    if (existingChat) {
      return next(
        createError(
          400,
          "A one-to-one chat already exists between these users."
        )
      );
    }

    const newChat = await Chat.create({ participants });

    io.emit("new_chat", newChat);
    participants.forEach((participantId: any) => {
      io.to(participantId).emit("new_chat", newChat);
    });

    successResponse(res, {
      message: "Chat created successfully.",
      payload: newChat,
    });
  } catch (error) {
    console.error(error);
    next(error);
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

    res.status(200).json(chat);
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
