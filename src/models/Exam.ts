import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  number: number;
  selectedOption?: number;
  timeSpent: number;
  answer: number;
}

export interface IExam extends Document {
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

export interface IntermediateExam {
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

const ExamSchema = new Schema<IExam>({
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
  viewed: { type: Boolean, default: false },
});

export default mongoose.models.Exam ||
  mongoose.model<IExam>("Exam", ExamSchema);
