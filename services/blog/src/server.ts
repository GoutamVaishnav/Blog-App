// import express from "express";
// import dotenv from "dotenv";
// import blogRoutes from "./routes/blog.js";
// import { createClient } from "redis";
// import cors from "cors";
// // import e from "express";
// import { startCacheConsumner } from "./utils/consumer.js";
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors());
// const port = process.env.PORT || 5002;

// app.use(express.json());

// export const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// redisClient
//   .connect()
//   .then(() => {
//     console.log("Connected to Redis");
//   })
//   .catch((err) => {
//     console.error("Redis connection error:", err);
//   });
// startCacheConsumner();
// app.use("/api/v1", blogRoutes);
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import { createClient } from "redis";
import cors from "cors";
import { startCacheConsumner } from "./utils/consumer.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5002;

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");

    // ✅ Redis ready hone ke baad hi consumer start karo
    startCacheConsumner();
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
