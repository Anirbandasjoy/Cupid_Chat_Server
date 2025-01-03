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
  "/process-singup",
  validateRequest(validateProcessRegistationSchema),
  handleProcessRegistation
);
userRouter.post(
  "/singup",
  validateRequest(validateRegistationSchema),
  handleRegisterdUser
);

userRouter.get("/find-users", isLogin, isAdmin, handleFindAllUsers);
