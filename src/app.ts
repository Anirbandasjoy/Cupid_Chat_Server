import http from "http";
import { Server as SocketIOServer } from "socket.io";
import express, {
  Application,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { createError } from "./config";
import { errorResponse, successResponse } from "./utils/response";
import rootRouter from "./routes";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(morgan("dev"));
app.use(fileUpload());

app.use(
  cors({
    origin: ["https://cupid-chat.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again after 15 minutes",
// });

app.get("/", (_req: Request, res: Response) => {
  successResponse(res, { message: "Welcome to the Cupid Chat" });
});

app.use("/api/v1", rootRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  return next(createError(404, "route not found"));
});

app.use(((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || "An unexpected error occurred";

  errorResponse(res, { statusCode, message, payload: err });
}) as unknown as ErrorRequestHandler);

// socket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send_message", (message) => {
    console.log("Received message:", message);
    io.emit("receive_message", message); // Broadcast to all clients
  });

  socket.on("typing", (data) => {
    // Emit typing event to everyone except the sender
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("stop_typing", (data) => {
    // Emit stop typing event to everyone except the sender
    socket.broadcast.emit("user_stopped_typing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
export default server;
export { io };
