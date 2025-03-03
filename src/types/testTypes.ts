import { IQuestion } from "@/models/Test";

export interface Question {
  number: number;
  selectedOption?: number;
  answer: number;
  timeSpent: number;
}
export type Test = {
  startTime: Date;
  endTime: Date;
  questions: IQuestion[];
  id: string;
};
