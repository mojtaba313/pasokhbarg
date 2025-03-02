// scripts/dropEmailIndex.js
import mongoose from "mongoose";
import User from "@/models/User";

const dropEmailIndex = async () => {
  await mongoose.connect('mongodb+srv://mojtabaganbari9085:WXjob37GHkKP76TP@cluster0.xht4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  await User.collection.dropIndex("email_1");
  console.log("Index 'email_1' dropped successfully");
  process.exit(0);
};

dropEmailIndex().catch((err) => {
  console.error("Error dropping index:", err);
  process.exit(1);
});