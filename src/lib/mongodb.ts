import mongoose from 'mongoose'

let MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async() => {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected To DB");
    }
  } catch (err) {
    console.error("Failed to Connect DB => ", err);
  }
};

export default connectDB