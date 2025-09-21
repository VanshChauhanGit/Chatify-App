import { Socket, Server as SocketIOServer } from "socket.io";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
  socket.on("getConversations", async (data) => {
    console.log("getConversations event: ", data);

    try {
      const userId = socket.data.userId;

      if (!userId) {
        return socket.emit("getConversations", {
          success: false,
          msg: "Unauthorized",
        });
      }

      const conversations = await Conversation.find({
        participants: userId,
      })
        .sort({ updatedAt: -1 })
        .populate({
          path: "lastMessage",
          select: "content senderid attachment createdAt",
        })
        .populate({
          path: "participants",
          select: "name avatar email username",
        })
        .lean();

      socket.emit("getConversations", {
        success: true,
        data: conversations,
        msg: "Conversations fetched successfully",
      });
    } catch (error) {
      console.log("getConversations error:", error);
      socket.emit("getConversations", {
        success: false,
        msg: "Failed get conversations",
      });
    }
  });

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
            select: "name username avatar email",
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
          select: "name usrername avatar email",
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

  socket.on("newMessage", async (data) => {
    console.log("newMessage event: ", data);

    try {
      const message = await Message.create({
        conversationId: data.conversationId,
        senderId: data.sender.id,
        content: data.content,
        attachment: data.attachment,
      });

      io.to(data.conversationId).emit("newMessage", {
        success: true,
        data: {
          id: message._id,
          content: data.content,
          sender: {
            id: data.sender.id,
            name: data.sender.name,
            avatar: data.sender.avatar,
          },
          attachment: data.attachment,
          createdAt: new Date().toISOString(),
          conversationId: data.conversationId,
        },
      });

      // update conversation's last message
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: message._id,
      });
    } catch (error) {
      console.log("newMessage error:", error);
      socket.emit("newMessage", {
        success: false,
        msg: "Failed to send message",
      });
    }
  });

  socket.on("getMessages", async (data: { conversationId: string }) => {
    console.log("getMessages event: ", data);

    try {
      const messages = await Message.find({
        conversationId: data.conversationId,
      })
        .sort({ createdAt: -1 })
        .populate<{ senderId: { _id: string; name: string; avatar: string } }>({
          path: "senderId",
          select: "name avatar email",
        })
        .lean();

      const messagesWithSender = messages.map((message) => ({
        ...message,
        id: message._id,
        sender: {
          id: message.senderId._id,
          name: message.senderId.name,
          avatar: message.senderId.avatar,
        },
      }));

      socket.emit("getMessages", { success: true, data: messagesWithSender });
    } catch (error) {
      console.log("getMessages error:", error);
      socket.emit("getMessages", {
        success: false,
        msg: "Failed to get messages",
      });
    }
  });
}
