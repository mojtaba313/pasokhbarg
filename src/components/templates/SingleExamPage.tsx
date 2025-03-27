"use client";
import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AdjustmentsHorizontalIcon,
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
  ClockIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/Timer";
import { IQuestion, IntermediateExam } from "@/models/Exam";
import QuestionRow from "../layout/QuestionRow";
import ConfirmModal from "../ConfirmModal";
import { Loader } from "../Loader";
import Spinner from "../Spinner";
import { InputSwitch } from "primereact/inputswitch";

interface Props {
  examID: string;
}

const SingleExamPage: FC<Props> = ({ examID }) => {
  const [exam, setExam] = useState<IntermediateExam>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [horizentalScroll, setHorizentalScroll] = useState(true);
  const router = useRouter();

  const fetchExam = async () => {
    const { data }: { data: IntermediateExam } = await axios.get(
      `/api/exams/${examID}`
    );
    if (data.endTime) router.push("/exams");
    setExam(data);
  };

  useEffect(() => {
    fetchExam();
  }, [examID]);

  const updateExam = async (newData?: IntermediateExam) => {
    setIsFetchingData(true);
    const res = await axios.put(`/api/exams/${examID}`, newData || exam);
    if (res.status === 201) setIsFetchingData(false);
  };

  if (!exam) return <Loader />;

  const handleEndExam = async () => {
    const res = await axios.put(`/api/exams/${examID}`, {
      endTime: new Date(),
    });

    if (res.status === 201) router.push("/exams");
  };

  const onPause = (number: number, addingTime: number) => {
    const newExam = {
      ...exam,
      questions: exam.questions?.map((q: IQuestion) =>
        q.number === number ? { ...q, timeSpent: addingTime } : q
      ),
    };
    setExam(newExam);
    updateExam(newExam);
  };

  const onChoose = (number: number, optionNumber: number) => {
    const newExam = {
      ...exam,
      questions: exam.questions?.map((q: IQuestion) =>
        q.number === number ? { ...q, selectedOption: optionNumber } : q
      ),
    };
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

          <Timer
            startTime={exam.startTime || new Date()}
            endTime={exam.endTime}
          />

          <h1 className="text-2xl">{exam.title}</h1>

          <div role="status" className={!isFetchingData ? "invisible" : ""}>
            <Spinner />
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-500/50"
            >
              پایان آزمون
            </button>
          </div>
        </div>

        {/* Setting options */}
        <div className="px-5 w-full fle- justify-evenly items-center py-2">
          <div className="flex gap-1">
            <AdjustmentsHorizontalIcon width={20} />
            <InputSwitch
              checked={horizentalScroll}
              onChange={(e) => setHorizentalScroll(e.value)}
            />
            <AdjustmentsVerticalIcon width={20} />
          </div>
        </div>

        {/* Questions Container */}
        <div
          className={`flex pb-28 px-3 gap-6 overflow-x-auto h-[calc(100vh-5rem)] items-start ${
            horizentalScroll
              ? "overflow-x-hidden flex-wrap justify-center items-center"
              : ""
          }`}
        >
          {Array(Math.ceil(exam.questions?.length / 10 || 0))
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
                  {exam.questions
                    .slice(10 * i, 10 * i + 10)
                    .map((question, j) => (
                      <div key={`${i}-${j}`}>
                        <QuestionRow
                          question={question}
                          currentQuestion={currentQuestion}
                          setCurrentQuestion={setCurrentQuestion}
                          onPause={onPause}
                          onChoose={onChoose}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* مودال تأیید پایان */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleEndExam}
        title="پایان آزمون"
        description="آیا مطمئن هستید که می‌خواهید این آزمون را پایان کنید؟ این عمل برگشت‌ناپذیر است."
      />
    </div>
  );
};

export default SingleExamPage;
