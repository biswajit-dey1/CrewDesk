import mongoose from "mongoose";

const connectDb = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL not set in environment")
  }
  await mongoose.connect(process.env.MONGODB_URL, { dbName: "CrewDesk" })
}


export default connectDb