"use client";
import { useState, useEffect, useCallback, FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/Timer";
import QuestionNavigation from "@/components/QuestionNavigation";
import { IQuestion } from "@/models/Test";
import QuestionRow from "../layout/QuestionRow";
import ConfirmModal from "../ConfirmModal";

interface Question {
  number: number;
  selectedOption?: number;
  timeSpent: number;
}

interface Props {
  testID: string;
}

type Test = {
  startTime: Date;
  endTime: Date;
  questions: IQuestion[];
  id: string;
};

const SingleTestPage: FC<Props> = ({ testID }) => {
  let ii = 1;
  const [test, setTest] = useState<Test>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTest = async () => {
      const { data }: { data: Test } = await axios.get(`/api/tests/${testID}`);
      setTest(data);
      console.log("first q", data);
    };

    fetchTest();
  }, [testID]);

  const updateTest = async (newData?: Test) =>
    await axios.put(`/api/tests/${testID}`, newData || test);

  if (!test) return <div>Loading...</div>;

  const handleEndTest = async () =>
    await axios.put(`/api/tests/${testID}`, {
      endTime: new Date(),
      questions: test.questions,
    });

  const onPause = (number: number, addingTime: number) => {
    const newTest = {
      ...test,
      questions: test.questions?.map((q: Question) =>
        q.number === number ? { ...q, timeSpent: addingTime } : q
      ),
    };
    setTest(newTest);
    updateTest(newTest);
  };

  const onChoose = (number: number, optionNumber: number) => {
    const newTest = {
      ...test,
      questions: test.questions?.map((q: Question) =>
        q.number === number ? { ...q, selectedOption: optionNumber } : q
      ),
    };
    setTest(newTest);
    updateTest(newTest);
  };

  return (
    <div className="min-h-screen w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="hidden xs:flex items-center justify-between p-8 h-20 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            بازگشت
          </button>

          <Timer startTime={test.startTime} endTime={test.endTime} />

          <button
            onClick={()=>setShowConfirmModal(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-500/50"
          >
            پایان آزمون
          </button>
        </div>

        {/* Questions Container */}
        <div className="flex gap-6 w-screen overflow-x-auto h-[calc(100vh-5rem)] items-start py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-20">
          {Array(Math.ceil(test.questions?.length / 10 || 0))
            .fill(0)
            .map((_, i) => (
              <div
                key={`${i}-`}
                className="border dark:border-slate-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[300px]"
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
                  {test.questions
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
        onConfirm={handleEndTest}
        title="پایان آزمون"
        description="آیا مطمئن هستید که می‌خواهید این آزمون را پایان کنید؟ این عمل برگشت‌ناپذیر است."
      />
    </div>
  );
};

export default SingleTestPage;
