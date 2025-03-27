"use client";
import { useState, useEffect, useCallback, FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "../Loader";
import ExamResultQuestionRow from "../layout/ExamResultQuestionRow";
import { countAnswers } from "@/utils/funcs";
import Timer from "../Timer";
import { IntermediateExam } from "@/models/Exam";

interface Props {
  examID: string;
}

const ResultPage: FC<Props> = ({ examID }) => {
  const [exam, setExam] = useState<IntermediateExam>();
  const router = useRouter();

  useEffect(() => {
    const fetchExam = async () => {
      const { data }: { data: IntermediateExam } = await axios.get(
        `/api/exams/${examID}`
      );
      setExam(data);
    };

    fetchExam();
  }, [examID]);

  const calclulatePercent = () => {
    let currectCount = 0;
    let inCurrectCount = 0;
    let noAnswer = 0;

    exam?.questions.map((q) => {
      if (q.answer) {
        if (!q.selectedOption) noAnswer++;
        else if (q.answer === q.selectedOption) currectCount++;
        else inCurrectCount++;
      }
    });

    const percent =
      ((currectCount - inCurrectCount / 3) /
        (currectCount + inCurrectCount + noAnswer)) *
      100;

    return percent;
  };

  if (!exam) return <Loader />;

  return (
    <div
      className="min-h-screen w-screen h-screen overflow-hidden transition-colors duration-300"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-panel bg-white/50 dark:!bg-slate-700/50 mt-2 hidden xs:flex items-center justify-between p-8 h-20 shadow-sm">
          <button
            onClick={() => router.push("/exams")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            بازگشت
          </button>

          {exam.startTime && exam.endTime && (
            <Timer startTime={exam.startTime} endTime={exam.endTime} />
          )}

          <h1 className="text-2xl">{exam.title}</h1>
        </div>

        {/* Questions Container */}
        <div className="flex pt-6 pb-28 overflow-y-scroll gap-6 flex-wrap justify-center items-center h-[calc(100vh-5rem)]">
          {/* Percent */}
          <div className="border p-7 text-3xl text-green-500 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            %{calclulatePercent().toFixed(2)}
          </div>

          {Array(Math.ceil(exam.questions?.length / 10 || 0))
            .fill(0)
            .map((_, i) => {
              const questions = exam.questions.slice(10 * i, 10 * i + 10);
              const { correct, incorrect, unanswered } =
                countAnswers(questions);
              return (
                <div
                  key={`${i}-`}
                  className="border dark:border-slate-700 rounded-lg bg-white/30 dark:bg-gray-800/30 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Card Header */}
                  <div className="flex justify-between p-4 border-b dark:border-slate-700">
                    <div className="flex gap-1 mx-1 items-center">
                      <CheckIcon className="text-green-500" width={20} />
                      <span>{correct}</span>
                    </div>
                    <div className="flex gap-1 mx-1 items-center">
                      <XMarkIcon className="text-red-500" width={20} />
                      <span>{incorrect}</span>
                    </div>
                    <div className="flex gap-1 mx-1 items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                      <span>{unanswered}</span>
                    </div>
                  </div>
                  {/* Questions List */}
                  <div className="flex flex-col p-4 space-y-3">
                    {exam.questions
                      .slice(10 * i, 10 * i + 10)
                      .map((question, j) => (
                        <div key={`${i}-${j}`}>
                          <ExamResultQuestionRow question={question} />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
