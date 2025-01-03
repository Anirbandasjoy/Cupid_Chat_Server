import {
  handleFindAllUsers,
  handleProcessRegistation,
  handleRegisterdUser,
} from "@/controllers/user.controller";
import { isAdmin, isLogin } from "@/middlewares/auth.middleware";
import validateRequest from "@/schemas";
import {
  validateProcessRegistationSchema,
  validateRegistationSchema,
} from "@/schemas/user.schema";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post(
  "/process-signup",
  validateRequest(validateProcessRegistationSchema),
  handleProcessRegistation
);
userRouter.post(
  "/signup",
  validateRequest(validateRegistationSchema),
  handleRegisterdUser
);

userRouter.get("/find-users", isLogin, isAdmin, handleFindAllUsers);

export default userRouter;
