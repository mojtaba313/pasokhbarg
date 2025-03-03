// models/Test.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  number: number;
  selectedOption?: number;
  timeSpent: number;
  answer: number;
}

export interface ITest extends Document {
  title: string;
  startQuestion: number;
  endQuestion: number;
  questions: IQuestion[];
  startTime: Date;
  endTime?: Date;
  notes: string;
  userId: string;
  viewed: boolean; // اضافه کردن فیلد viewed
}

export interface IntermediateTest {
  _id: string;
  title: string;
  startQuestion: number;
  endQuestion: number;
  questions: IQuestion[];
  startTime: Date;
  endTime?: Date;
  notes: string;
  userId: string;
  viewed: boolean;
}

const TestSchema = new Schema<ITest>({
  title: { type: String, required: true },
  startQuestion: { type: Number, required: true },
  endQuestion: { type: Number, required: true },
  questions: [
    {
      number: Number,
      selectedOption: Number,
      answer: Number,
      timeSpent: { type: Number, default: 0 },
    },
  ],
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  notes: String,
  userId: { type: String, required: true },
  viewed: { type: Boolean, default: false }, // اضافه کردن فیلد viewed
});

export default mongoose.models.Test ||
  mongoose.model<ITest>("Test", TestSchema);
