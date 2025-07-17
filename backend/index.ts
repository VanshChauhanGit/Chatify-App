import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

const server = http.createServer(app);

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
