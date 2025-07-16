import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log(
      "Failed to start server due to database connection error:",
      error
    );
  });
