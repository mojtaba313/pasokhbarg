"use client";
import { useState, useEffect, FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
  ClockIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/Timer";
import { IQuestion, IntermediateExam } from "@/models/Exam";
import QuestionRow from "../layout/QuestionRow";
import ConfirmModal from "../ConfirmModal";
import { Loader } from "../Loader";
import { useSession } from "next-auth/react";
import { IGroupExam } from "@/models/GroupExam";
import Spinner from "../Spinner";

interface Props {
  examId: string;
}

const SingleGroupExamPage: FC<Props> = ({ examId }) => {
  const [exam, setExam] = useState<IGroupExam>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const router = useRouter();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const { data: session } = useSession();
  const [isFirstTime, setIsFirstTime] = useState(true);

  const fetchExam = useCallback(async () => {
    try {
      const res = await axios.get(`/api/exams/group/${examId}/participant`);
      if (res.status === 200) {
        const { exam, participant }: { exam: IGroupExam; participant: any } =
          res.data;
        console.log("participant", participant);
        if (exam.endTime) router.push("/exams");
        setExam(exam);
        const setting =
          participant?.answers?.map((p: any) => ({ ...p, isSaving: false })) ||
          [];
        console.log("setting", setting);
        setQuestions(setting);
        if (isFirstTime) {
          setCurrentQuestion(exam.startQuestion);
          setIsFirstTime(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch exam:", error);
    }
  }, [examId, session?.user?._id, router, isFirstTime]);

  useEffect(() => {
    if (examId && session?.user?._id) {
      fetchExam();
    }
  }, [examId, session?.user?._id]);

  useEffect(() => {
    console.log("exam", exam);
    console.log("questions", questions);
  }, [exam, questions]);

  const toggleRowDisable = (number: number, savingState?: boolean) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.number === number
          ? {
              ...q,
              isSaving: savingState === undefined ? !q.isSaving : savingState,
            }
          : q
      )
    );
  };

  const updateQuestions = async (
    newQuestions: IQuestion[],
    changeQuestionNumber: number
  ) => {
    try {
      setIsFetchingData(true);
      toggleRowDisable(changeQuestionNumber, true);
      const res = await axios.put(
        `/api/exams/group/${examId}/participant`,
        newQuestions
      );
      if (res.data.success) {
        setQuestions(newQuestions);
        fetchExam();
      }
    } catch (error) {
      console.error("Failed to update questions:", error);
      toggleRowDisable(changeQuestionNumber, false);
    } finally {
      setIsFetchingData(false);
    }
  };

  const onChoose = (number: number, optionNumber: number) => {
    if (questions.length === 0) return;
    const newQuestions = questions.map((q) =>
      q.number === number ? { ...q, selectedOption: optionNumber } : q
    );
    updateQuestions(newQuestions, number);
  };

  const onPause = (number: number, addingTime: number) => {
    if (!exam) return;
    const newQuestions = questions?.map((q: any) =>
      q.number === number ? { ...q, timeSpent: addingTime } : q
    );
    updateQuestions(newQuestions, number);
  };

  if (!exam) return <Loader />;

  return (
    <div
      className="min-h-screen w-screen h-screen overflow-hidden transition-colors duration-300"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-panel bg-white/20 mt-2 hidden xs:flex items-center justify-between p-8 h-20 shadow-sm">
          <button
            onClick={() => router.push("/exams")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            بازگشت
          </button>

          <Timer startTime={exam.startTime as Date} />

          <h1 className="text-2xl">{exam.title}</h1>

          <div role="status" className={!isFetchingData ? "invisible" : ""}>
            <Spinner />
          </div>
        </div>

        {/* Questions Container */}
        <div
          className={`flex pb-32 pl-5 gap-6 w-screen overflow-x-auto h-[calc(100vh-5rem)] items-start py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-20`}
        >
          {Array(Math.ceil(questions?.length / 10 || 0))
            .fill(0)
            .map((_, i) => (
              <div
                key={`${i}-`}
                className="glass-effect border rounded-lg dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[300px]"
              >
                {/* Card Header */}
                <div className="flex justify-between p-4 border-b dark:border-gray-700 pr-8">
                  <div>
                    <ListBulletIcon width={25} className="text-blue-500" />
                  </div>
                  <div>
                    <ClockIcon width={25} className="text-yellow-500" />
                  </div>
                </div>

                {/* Questions List */}
                <div className="flex flex-col p-4 space-y-3">
                  {questions.slice(10 * i, 10 * i + 10).map((question, j) => (
                    <div key={`${i}-${j}`}>
                      <QuestionRow
                        onPause={onPause}
                        question={question}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        onChoose={onChoose}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleGroupExamPage;
