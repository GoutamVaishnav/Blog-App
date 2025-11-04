import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import {createClient } from "redis"
import e from "express";
dotenv.config();
const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());

export const redisClient = createClient({
  url: process.env.REDIS_URL
}); 
redisClient.connect().then(() => {
  console.log("Connected to Redis");
}).catch((err) => {
  console.error("Redis connection error:", err);
});

app.use("/api/v1", blogRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
