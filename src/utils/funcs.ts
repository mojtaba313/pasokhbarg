import { Question } from "@/types/testTypes";

export const foramttMin = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

export const countAnswers = (questions: Question[]) => {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((q) => {
    if (!q.selectedOption) {
      unanswered++;
    } else if (q.selectedOption === q.answer) {
      correct++;
    } else if (q.answer) {
      incorrect++;
    }
  });

  return { correct, incorrect, unanswered };
};
