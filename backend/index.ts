import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import { initializeSocket } from "./socket/socket";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the Chatify server!");
});

const server = http.createServer(app);

// listen to socket events
initializeSocket(server);

connectDB()
  .then(() => {
    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log(
      "Failed to start server due to database connection error:",
      error
    );
  });
