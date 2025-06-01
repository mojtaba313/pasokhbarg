"use client";
import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/Timer";
import { IntermediateExam } from "@/models/Exam";
import { Loader } from "../Loader";
import AddAnswerQuestionRow from "../layout/AddAnswerQuestionRow";
import { countAnswers } from "@/utils/funcs";
import Spinner from "../Spinner";
import { IntermediateGroupExam } from "@/models/GroupExam";

interface Props {
  examID: string;
}
interface Question {
  number: number;
  answer: number;
}

const GroupExamAddAnwersPage: FC<Props> = ({ examID }) => {
  const [exam, setExam] = useState<IntermediateGroupExam>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const router = useRouter();

  const fetchExam = async () => {
    const { data }: { data: IntermediateGroupExam } = await axios.get(
      `/api/exams/group/${examID}`
    );
    setQuestions(data.questions);
    setExam(data);
  };

  const updateQuestions = async (newQuestions: Question[]) => {
    console.log(newQuestions);
    setIsFetchingData(true);
    const res = await axios.put(`/api/exams/group/${examID}`, {
      action: "add-answers",
      questions: newQuestions,
    });
    if (res.status === 201) setIsFetchingData(false);
  };

  useEffect(() => {
    fetchExam();
  }, [examID]);

  if (!exam) return <Loader />;

  const onChoose = (number: number, answer: number) => {
    const newQuestions = questions.map((q) =>
      q.number === number ? { ...q, answer } : q
    );
    setQuestions(newQuestions);
    updateQuestions(newQuestions);
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
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            بازگشت
          </button>

          {exam.startTime && exam.endTime && (
            <Timer startTime={exam.startTime} endTime={exam.endTime} />
          )}

          <h1 className="text-2xl">{exam.title}</h1>

          <div role="status" className={!isFetchingData ? "invisible" : ""}>
            <Spinner />
          </div>
        </div>

        {/* Questions Container */}
        <div className="flex pt-6 pb-28 overflow-y-scroll gap-6 flex-wrap justify-center items-center h-[calc(100vh-5rem)]">
          {Array(Math.ceil(questions?.length / 10 || 0))
            .fill(0)
            .map((_, i) => {
              const paginatedQuestion = questions.slice(10 * i, 10 * i + 10);

              return (
                <div
                  key={`${i}-`}
                  className="border dark:border-slate-700 rounded-lg overflow-hidden bg-white/30 dark:bg-slate-800/30 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col p-4 space-y-3">
                    {paginatedQuestion.map((question, j) => (
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

export default GroupExamAddAnwersPage;
