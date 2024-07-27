import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongodb connected successfull");
  } catch (error) {
    console.log(error.message);
  }
};
