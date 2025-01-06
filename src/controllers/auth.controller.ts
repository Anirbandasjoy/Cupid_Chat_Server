import {
  createError,
  jwt_access_exp,
  jwt_access_secret,
  jwt_password_reset_exp,
  jwt_password_reset_secret,
  jwt_refresh_secret,
} from "@/config";
import {
  accessRefreshTokenAndCookieSeter,
  createToken,
  setAccessTokenCookie,
} from "@/utils";
import { successResponse } from "@/utils/response";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { Response, Request, NextFunction, CookieOptions } from "express";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { resetPasswordEmail } from "@/service/email/emailTemplates/resetPasswordEmail";
import sendingEmail from "@/service/email";

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User Not Registerd. Please SignUp Frist"));
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return next(createError(400, "Invalid credentials"));
    }
    const data = {
      user: {
        _id: user._id as Types.ObjectId,
        email: user.email,
      },
      res,
      next,
    };

    await accessRefreshTokenAndCookieSeter(data);

    successResponse(res, {
      message: "Logged in successfully",
      payload: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    successResponse(res, {
      message: "LogOut successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const handelRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const decodedToken = jwt.verify(oldRefreshToken, jwt_refresh_secret);
    if (typeof decodedToken !== "object" || !decodedToken.user) {
      throw createError(400, "Invalid refresh token. Please loginIn");
    }

    const accessToken = createToken(
      {
        user: decodedToken?.user,
      },
      jwt_access_secret,
      jwt_access_exp
    );

    if (!accessToken) {
      return next(
        createError(401, "Somthing was wrong not created access token")
      );
    }

    setAccessTokenCookie(res, accessToken);
    successResponse(res, {
      statusCode: 200,
      message: "New access token is genareted",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(409, "User not found, please register frist ");
    }
    const token = createToken(
      { email },
      jwt_password_reset_secret,
      jwt_password_reset_exp
    );

    if (!token) {
      throw createError(401, "Not Genaret Token");
    }

    const emailData = {
      email,
      subject: "Forgot Your Password",
      html: resetPasswordEmail(email, token),
    };

    try {
      await sendingEmail(emailData);
    } catch (error) {
      console.log(error);
      next(error);
    }
    return successResponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for  complete your password reset  process `,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

export const handleResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, jwt_password_reset_secret) as JwtPayload;
    if (!decoded) {
      throw createError(401, "Invalid token or expired token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const filter = { email: decoded.email };
    const update = { password: hashedPassword };
    const option = { new: true };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);

    if (!updatedUser) {
      throw createError(403, "Password reset failed");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
