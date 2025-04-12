import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionAnalysis {
  chapter?: string;
  topic?: string;
  description?: string;
}

export interface IQuestion {
  number: number;
  selectedOption?: number;
  timeSpent: number;
  answer: number;
  isSaving?: boolean;
  createdAt?: Date;
  analysis?: IQuestionAnalysis;
}

export interface IExam extends Document {
  title: string;
  startQuestion: number;
  endQuestion: number;
  questions: IQuestion[];
  startTime?: Date;
  endTime?: Date;
  userId?: string;
  viewed: boolean;
  createdAt?: Date;
}

export interface IntermediateExam {
  _id: string;
  title: string;
  startQuestion: number;
  endQuestion: number;
  questions: IQuestion[];
  startTime?: Date;
  endTime?: Date;
  userId?: string;
  viewed: boolean;
  createdAt?: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    startQuestion: Number,
    endQuestion: Number,
    questions: [
      {
        number: Number,
        selectedOption: Number,
        answer: Number,
        timeSpent: { type: Number, default: 0 },
        analysis: {
          chapter: String,
          topic: String,
          description: String,
        },
      },
    ],
    startTime: Date,
    endTime: Date,
    userId: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Exam ||
  mongoose.model<IExam>("Exam", ExamSchema);
