import mongoose from 'mongoose'

let MONGODB_URI = process.env.MONGODB_URI as string;
// MONGODB_URI = "mongodb://localhost:27017/pasokhbarg";

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
// }

// let cached = (global as any).mongoose

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null }
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     }

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose
//     })
//   }

//   try {
//     cached.conn = await cached.promise
//   } catch (e) {
//     cached.promise = null
//     throw e
//   }

//   return cached.conn
// }

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