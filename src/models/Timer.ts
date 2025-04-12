import mongoose from "mongoose";

const TimerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sessions: [
    {
      startTime: { type: Date, required: true },
      endTime: { type: Date },
    },
  ],
  userId: { type: String, required: true },
});

export default mongoose.models.Timer || mongoose.model("Timer", TimerSchema);
