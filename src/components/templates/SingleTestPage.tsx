"use client";
import { useState, useEffect, useCallback, FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/Timer";
import QuestionNavigation from "@/components/QuestionNavigation";

interface Question {
  number: number;
  selectedOption?: number;
  timeSpent: number;
}

interface Props {
  testID: string;
}

const SingleTestPage: FC<Props> = ({ testID }) => {
  const [test, setTest] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [mobilePage, setMobilePage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchTest = async () => {
      if (!testID) return;
      const { data } = await axios.get(`/api/tests/${testID}`);
      setTest(data);
      setNotes(data.notes);
    };

    fetchTest();
  }, [testID]);

  const updateQuestion = useCallback(
    async (question: Question) => {
      setTest((prev: any) => ({
        ...prev,
        questions: prev.questions?.map((q: Question) =>
          q.number === question.number ? question : q
        ),
      }));

      await axios.put(`/api/tests/${testID}`, {
        questions: test.questions,
        notes,
      });
    },
    [testID, notes, test?.questions]
  );

  const handleEndTest = async () => {
    await axios.put(`/api/tests/${testID}`, {
      endTime: new Date(),
      questions: test.questions,
      notes,
    });
    router.push(`/test/${testID}/summary`);
  };

  if (!test) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            بازگشت
          </button>
          <Timer startTime={test.startTime} endTime={test.endTime} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Question Navigation */}
          {test.questions && (
            <QuestionNavigation
              questions={test.questions}
              currentQuestion={currentQuestion}
              onChangeQuestion={setCurrentQuestion}
              mobilePage={mobilePage}
              onPageChange={setMobilePage}
            />
          )}

          {/* Current Question */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <DocumentTextIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">
                سوال {currentQuestion + 1}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      updateQuestion({
                        ...test.questions?.[currentQuestion],
                        selectedOption: option,
                      })
                    }
                    className={`p-4 rounded-lg ${
                      test.questions?.[currentQuestion].selectedOption ===
                      option
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    گزینه {option}
                  </button>
                ))}
              </div>

              <div className="border-t pt-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="یادداشت‌های شما..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleEndTest}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            پایان آزمون
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleTestPage;
