import { Schema, model } from "mongoose";
import { UserProps } from "../types";

const UserSchema = new Schema<UserProps>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model<UserProps>("User", UserSchema);
