import mongoose, { Document, Schema } from "mongoose";

export interface IntermediateGroupExam {
  _id: string;
  title: string;
  startQuestion: number;
  endQuestion: number;
  questions: { number: number; answer: number }[];
  startTime?: Date;
  endTime?: Date;
  adminId: string;
  allowedSubsets: string[];
  participants: {
    userId: string;
    answers: participantsAnswer[];
    startTime: Date;
    endTime?: Date;
  }[];
}

export interface participantsAnswer {
  selectedOption: number;
  timeSpent: number;
  number: number;
}

export interface IGroupExam extends Document {
  _id: string;
  title: string;
  startQuestion: number;
  endQuestion: number;
  questions: { number: number; answer: number }[];
  startTime?: Date;
  endTime?: Date;
  adminId: string;
  allowedSubsets: string[];
  participants: {
    userId: string;
    answers: participantsAnswer[];
    startTime: Date;
    endTime?: Date;
  }[];
}

const GroupExamSchema = new Schema<IGroupExam>({
  title: { type: String, required: true },
  startQuestion: Number,
  endQuestion: Number,
  questions: [
    {
      number: Number,
      answer: Number,
    },
  ],
  startTime: Date,
  endTime: Date,
  adminId: String,
  allowedSubsets: [{ type: Schema.Types.ObjectId, ref: "User" }],
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      answers: [{ selectedOption: Number, timeSpent: Number, number: Number }],
      startTime: Date,
      endTime: Date,
    },
  ],
});

export default mongoose.models.GroupExam ||
  mongoose.model<IGroupExam>("GroupExam", GroupExamSchema);
