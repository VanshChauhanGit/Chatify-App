import dotenv from "dotenv";
import { Socket, Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { registerUserEvents } from "./userEvents";
import { register } from "module";
import { registerChatEvents } from "./chatEvents";
import Conversation from "../models/Conversation";

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
  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}, userName: ${socket.data.name}`);

    // register events
    registerUserEvents(io, socket);
    registerChatEvents(io, socket);

    // join all the conversations the user is part of
    try {
      const conversations = await Conversation.find({
        participants: userId,
      }).select("_id");

      conversations.forEach((conversation) => {
        socket.join(conversation._id.toString());
      });
    } catch (error) {
      console.log("Error joining conversations :", error);
    }

    socket.on("disconnect", () => {
      // user logs out
      console.log(
        `User disconnected: ${userId}, userName: ${socket.data.name}`
      );
    });
  });

  return io;
}
