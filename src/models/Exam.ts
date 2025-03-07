// import mongoose, { Document, Schema } from "mongoose";

// export interface IQuestion {
//   number: number;
//   selectedOption?: number;
//   timeSpent: number;
//   answer: number;
// }

// export interface IExam extends Document {
//   _id: string;
//   title: string;
//   startQuestion: number;
//   endQuestion: number;
//   questions: IQuestion[];
//   startTime: Date;
//   endTime?: Date;
//   notes: string;
//   userId: string;
//   viewed: boolean;
// }

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
  status: string;
}

// const ExamSchema = new Schema<IExam>({
//   title: { type: String, required: true },
//   startQuestion: { type: Number, required: true },
//   endQuestion: { type: Number, required: true },
//   questions: [
//     {
//       number: Number,
//       selectedOption: Number,
//       answer: Number,
//       timeSpent: { type: Number, default: 0 },
//     },
//   ],
//   startTime: { type: Date, default: Date.now },
//   endTime: Date,
//   notes: String,
//   userId: { type: String, required: true },
//   viewed: { type: Boolean, default: false },
// });

// export default mongoose.models.Exam ||
//   mongoose.model<IExam>("Exam", ExamSchema);

// models/Exam.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  number: number;
  selectedOption?: number;
  timeSpent: number;
  answer: number;
}

export interface IExam extends Document {
  title: string;
  type: "individual" | "group";
  startQuestion: number;
  endQuestion: number;
  questions: IQuestion[];
  startTime: Date;
  endTime?: Date;
  userId?: string; // برای آزمونهای فردی
  adminId?: string;
  allowedSubsets: string[]; // آرایه ای از شناسه های زیرمجموعه ها
  status: "planned" | "active" | "finished";
  participants: {
    userId: string;
    answers: [{ selectedOption: number; timeSpent: number; number: number }];
    startTime: Date;
    endTime?: Date;
  }[];
}

const ExamSchema = new Schema<IExam>({
  title: { type: String, required: true },
  type: { type: String, enum: ["individual", "group"], default: "individual" },
  startQuestion: Number,
  endQuestion: Number,
  questions: [
    {
      number: Number,
      selectedOption: Number,
      answer: Number,
      timeSpent: { type: Number, default: 0 },
    },
  ],
  startTime: Date,
  endTime: Date,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  adminId: String,
  allowedSubsets: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["planned", "active", "finished"],
    default: "planned",
  },
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      answers: [{ selectedOption: Number, timeSpent: Number, number: Number }],
      startTime: Date,
      endTime: Date,
    },
  ],
});

export default mongoose.models.Exam ||
  mongoose.model<IExam>("Exam", ExamSchema);
