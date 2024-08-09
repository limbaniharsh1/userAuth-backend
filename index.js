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
console.log(redis.getValue("blacklisted"))
// redis.disconnect();

// await client
//   .set("harsh", "laskndvjndskjvnkjsd")
//   .then(() => console.log("data added"))
// .catch((err) => console.log(err));

// console.log(await client.get(""))

connectDb();
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
