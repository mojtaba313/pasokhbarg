"use client";
import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/Timer";
import { IntermediateExam } from "@/models/Exam";
import { Loader } from "../Loader";
import AddAnswerQuestionRow from "../layout/AddAnswerQuestionRow";
import { Question } from "@/types/examTypes";
import { countAnswers } from "@/utils/funcs";
import Spinner from "../Spinner";

interface Props {
  examID: string;
}

const AddAnwersPage: FC<Props> = ({ examID }) => {
  const [exam, setExam] = useState<IntermediateExam>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [isFetchingData, setIsFetchingData] = useState(false);
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

  const updateExam = async (newData?: IntermediateExam) => {
    setIsFetchingData(true);
    const res = await axios.put(`/api/exams/${examID}`, newData || exam);
    if (res.status === 201) setIsFetchingData(false);
  };

  if (!exam) return <Loader />;

  const onChoose = (number: number, answer: number) => {
    const newExam = {
      ...exam,
      questions: exam.questions?.map((q: Question) =>
        q.number === number ? { ...q, answer } : q
      ),
    };
    console.log('newData',newExam)
    setExam(newExam);
    updateExam(newExam);
  };

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
            <Timer
              startTime={exam.startTime}
              endTime={exam.endTime}
            />
          )}

          <h1 className="text-2xl">{exam.title}</h1>

          <div role="status" className={!isFetchingData ? "invisible" : ""}>
            <Spinner />
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
                  className="border dark:border-slate-700 rounded-lg overflow-hidden bg-white/30 dark:bg-slate-800/30 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Card Header */}
                  <div className="flex justify-between p-4 border-b bg-white/50 dark:bg-slate-800/50 dark:border-slate-700/50">
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
                    {questions.map((question, j) => (
                      <div key={`${i}-${j}`}>
                        <AddAnswerQuestionRow
                          currentQuestion={currentQuestion}
                          setCurrentQuestion={setCurrentQuestion}
                          onChoose={onChoose}
                          question={question}
                        />
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

export default AddAnwersPage;
