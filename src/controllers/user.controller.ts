import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import { userExistByEmail } from "@/service/user/user.service";
import { createToken } from "@/utils";
import jwt from "jsonwebtoken";
import {
  createError,
  process_registation_expires_in,
  process_registation_secret_key,
} from "@/config";
import sendingEmail from "@/service/email";
import { successResponse } from "@/utils/response";
import { activationEmail } from "@/service/email/emailTemplates/resetPasswordEmail";
import { findWithId } from "@/service";

export const handleProcessRegistation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    await userExistByEmail(email, User);
    const token = createToken(
      {
        name,
        email,
        password: hashPassword,
      },
      process_registation_secret_key,
      process_registation_expires_in
    );
    if (!token) {
      throw createError(401, "Not Genaret Token");
    }
    const emailData = {
      email,
      subject: "Invaitation Email",
      html: activationEmail(name, token),
    };
    try {
      await sendingEmail(emailData);
    } catch (error) {
      console.error(error);
    }
    successResponse(res, {
      message: `Please Active you email : ${email}`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

export const handleRegisterdUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw createError(404, "Token Not found");
    }
    const decoded = jwt.verify(
      token,
      process_registation_secret_key
    ) as jwt.JwtPayload;
    if (!decoded) {
      throw createError(203, "Invalid Token");
    }

    await userExistByEmail(decoded.email, User);

    await User.create(decoded);
    successResponse(res, {
      message: "Registation Process Complete",
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const option = { password: 0 };
    const count = await User.countDocuments(filter);

    const users = await User.find(filter, option)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    if (!users || users.length === 0)
      return next(createError(404, "user not found"));

    successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await findWithId(id, User);
    successResponse(res, {
      message: "Single User fetched successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};
