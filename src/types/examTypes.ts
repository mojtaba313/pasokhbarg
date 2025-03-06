import { IQuestion } from "@/models/Exam";

export interface Question {
  number: number;
  selectedOption?: number;
  answer: number;
  timeSpent: number;
}
export type Exam = {
  startTime: Date;
  endTime: Date;
  questions: IQuestion[];
  id: string;
};
