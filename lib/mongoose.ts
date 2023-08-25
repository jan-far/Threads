import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strict", true);

  if (!process.env.MONGODB_URL) return console.log("MongoDb url not found");
  if (isConnected) return console.log("Already connected!");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
