import {
  handelRefreshToken,
  handleForgotPassword,
  handleLogin,
  handleLogOut,
  handleResetPassword,
} from "@/controllers/auth.controller";
import { isLogin, isLogOut } from "@/middlewares/auth.middleware";
import validateRequest from "@/schemas";
import {
  validateForgotPassword,
  validateLogin,
  validateResetPassword,
} from "@/schemas/auth.schema";
import { Router } from "express";
const authRouter: Router = Router();

authRouter.post(
  "/login",
  isLogOut,
  validateRequest(validateLogin),
  handleLogin
);

authRouter.post("/logOut", isLogin, handleLogOut);
authRouter.get("/refresh-token", handelRefreshToken);

authRouter.post(
  "/forgot-password",
  validateRequest(validateForgotPassword),
  handleForgotPassword
);
authRouter.put(
  "/reset-password",
  validateRequest(validateResetPassword),
  handleResetPassword
);

export default authRouter;
