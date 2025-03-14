import { Question } from "@/types/examTypes";

export const foramttMin = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

export const foramttHour = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
};

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

export const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("fa-IR");
