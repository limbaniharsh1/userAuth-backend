import express from "express";
import authRoutes from "./routes/auth.js";
import { connectDb } from "./db.js";
import { config } from "dotenv";
config()

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

connectDb();
app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
