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
import { Question, Exam } from "@/types/examTypes";

interface Props {
  examID: string;
}

const ResultPage: FC<Props> = ({ examID }) => {
  const [exam, setExam] = useState<Exam>();
  const [isFetchingData, setIsFetchingData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchExam = async () => {
      const { data }: { data: Exam } = await axios.get(`/api/exams/${examID}`);
      setExam(data);
    };

    fetchExam();
  }, [examID]);

  const updateExam = async (newData?: Exam) => {
    setIsFetchingData(true);
    const res = await axios.put(`/api/exams/${examID}`, newData || exam);
    if (res.status === 201) setIsFetchingData(false);
  };

  if (!exam) return <Loader />;

  const handleEndExam = async () => {
    const res = await axios.put(`/api/exams/${examID}`, {
      endTime: new Date(),
      questions: exam.questions,
    });

    if (res.status === 201) router.push("/exams");
  };


  return (
    <div
      className="min-h-screen w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="hidden xs:flex items-center justify-between p-8 h-20 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            بازگشت
          </button>

          <div className="flex items-center justify-center">
            <div role="status" className={!isFetchingData ? "invisible" : ""}>
              <svg
                aria-hidden="true"
                className="w-6 h-6 mx-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>

        {/* Questions Container */}
        <div className="flex gap-6 w-screen overflow-x-auto h-[calc(100vh-5rem)] items-start py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-20">
          {Array(Math.ceil(exam.questions?.length / 10 || 0))
            .fill(0)
            .map((_, i) => {
              const questions = exam.questions.slice(10 * i, 10 * i + 10);
              const { correct, incorrect, unanswered } =
                countAnswers(questions);
              return (
                <div
                  key={`${i}-`}
                  className="border dark:border-slate-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
