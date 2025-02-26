import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  number: number;
  selectedOption?: number;
  timeSpent: number;
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
}

const TestSchema = new Schema<ITest>({
  title: { type: String, required: true },
  startQuestion: { type: Number, required: true },
  endQuestion: { type: Number, required: true },
  questions: [{
    number: Number,
    selectedOption: Number,
    timeSpent: { type: Number, default: 0 }
  }],
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  notes: String,
  userId: String
});

export default mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);