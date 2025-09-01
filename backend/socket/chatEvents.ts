import { Socket, Server as SocketIOServer } from "socket.io";
import Conversation from "../models/Conversation";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
  socket.on("newConversation", async (data) => {
    console.log("newConversation event: ", data);

    try {
      if (data.type == "direct") {
        // check if conversation already exists
        const existingConversation = await Conversation.findOne({
          type: "direct",
          participants: { $all: data.participants, $size: 2 },
        })
          .populate({
            path: "participants",
            select: "name avatar email",
          })
          .lean();

        if (existingConversation) {
          return socket.emit("newConversation", {
            success: true,
            data: { ...existingConversation, isNew: false },
            msg: "Conversation already exists",
          });
        }
      }

      const newConversation = await Conversation.create({
        type: data.type,
        participants: data.participants,
        name: data.name || "",
        avatar: data.avatar || "",
        createdBy: socket.data.userId,
      });

      // get all connected sockets
      const connectedSockets = Array.from(io.sockets.sockets.values()).filter(
        (s) => data.participants.includes(s.data.userId)
      );

      // join this conversation by all online participants
      connectedSockets.forEach((participantSocket) => {
        participantSocket.join(newConversation._id.toString());
      });

      // sends conversation data back (populated)
      const populatedConversation = await Conversation.findById(
        newConversation._id
      )
        .populate({
          path: "participants",
          select: "name avatar email",
        })
        .lean();

      if (!populatedConversation) {
        throw new Error("Failed to populate the conversation");
      }

      // emit conversation to all participants
      io.to(newConversation._id.toString()).emit("newConversation", {
        success: true,
        data: { ...populatedConversation, isNew: true },
        msg: "Conversation created successfully",
      });
    } catch (error) {
      console.log("newConversation error:", error);
      socket.emit("newConversation", {
        success: false,
        msg: "Failed to create conversations",
      });
    }
  });
}
