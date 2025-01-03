import { Router } from "express";
import authRouter from "./auth.router";
import chatRouter from "./chat.router";
import messageRouter from "./message.router";
import userRouter from "./user.router";

const rootRouter: Router = Router();
rootRouter.use("/user", userRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/chat", chatRouter);
rootRouter.use("/message", messageRouter);

export default rootRouter;
