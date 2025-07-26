import dotenv from "dotenv";
import { Socket, Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { registerUserEvents } from "./userEvents";

dotenv.config();

export function initializeSocket(server: any): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  // auth middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      next(new Error("Authentication error: no token provided"));
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          next(new Error("Authentication error: invalid token"));
        }

        // attach userdata to socket
        let userData = decoded.user;
        socket.data = userData;
        socket.data.userId = userData.id;
        next();
      }
    );
  });

  // when socket connects, register events
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}, userName: ${socket.data.name}`);

    // register events
    registerUserEvents(io, socket);

    socket.on("disconnect", () => {
      // user logs out
      console.log(
        `User disconnected: ${userId}, userName: ${socket.data.name}`
      );
    });
  });

  return io;
}
