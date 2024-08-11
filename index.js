import express from "express";
import authRoutes from "./routes/auth.js";
import { connectDb } from "./db.js";
import { config } from "dotenv";
import { redisHandler } from "./helper/redisHandler.js";

config();

const redis = redisHandler();
redis.connect();

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
// 66a530e0cf27e44272bd9ebc
// console.log(await redis.getMultiValue("66a530e0cf27e44272bd9ebc"));
// await redis.flushAll()

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});

process.on("SIGINT", async () => {
  // await redis.disconnect();
  process.exit();
});
