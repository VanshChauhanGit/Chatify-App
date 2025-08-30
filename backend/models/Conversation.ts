import mongoose from "mongoose";
import { ConversationProps } from "../types";

const ConversationSchema = new mongoose.Schema<ConversationProps>({
  type: {
    type: String,
    enum: ["direct", "group"],
    required: true,
  },
  name: String,
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ConversationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Conversation", ConversationSchema);
