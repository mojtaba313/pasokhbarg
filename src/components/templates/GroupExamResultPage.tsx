"use client";
import { useState, useEffect, useCallback, FC, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "../Loader";
import ExamResultQuestionRow from "../layout/ExamResultQuestionRow";
import { claculatePercent, countAnswers } from "@/utils/funcs";
import Timer from "../Timer";
import { IntermediateExam, IQuestion, IQuestionAnalysis } from "@/models/Exam";
import QuestionAnalysisModal from "../QuestionAnalysisModal";
import ChapterSummaryTable from "../ChapterSummaryTable";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import ExportModal from "../ExportModal";
import {
  IntermediateGroupExam,
  IntermediateParticipant,
} from "@/models/GroupExam";

interface Props {
  examID: string;
}

const GroupExamResultPage: FC<Props> = ({ examID }) => {
  const [exam, setExam] = useState<IntermediateGroupExam>();
  const [participant, setParticipant] = useState<IntermediateParticipant>();
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [showDetails, setshowDetails] = useState(false);
  const [showExportModal, setshowExportModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isAnlisSaving, setIsAnlisSaving] = useState(false);
  const [chapters, setChapters] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [chapterSummary, setChapterSummary] = useState<any[]>([]);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const fetchExam = async () => {
    const {
      data,
    }: {
      data: {
        exam: IntermediateGroupExam;
        participant: IntermediateParticipant;
      };
    } = await axios.get(`/api/exams/group/${examID}/participant`);
    const { exam, participant } = data;
    setExam(exam);
    setParticipant(participant);
    // extractChaptersAndTopics(exam);
    // calculateChapterSummary(data);
  };

  useEffect(() => {
    fetchExam();
  }, [examID]);

  const extractChaptersAndTopics = (examData: IntermediateExam) => {
    const uniqueChapters = new Set<string>();
    const uniqueTopics = new Set<string>();

    examData.questions.forEach((q) => {
      if (q.analysis?.chapter) {
        uniqueChapters.add(q.analysis.chapter);
      }
      if (q.analysis?.topic) {
        uniqueTopics.add(q.analysis.topic);
      }
    });

    setChapters(Array.from(uniqueChapters));
    setTopics(Array.from(uniqueTopics));
  };

  const calculateChapterSummary = (examData: IntermediateExam) => {
    const summaryMap: Record<
      string,
      {
        correct: number;
        incorrect: number;
        unanswered: number;
        total: number;
      }
    > = {};

    examData.questions.forEach((q) => {
      const chapter = q.analysis?.chapter || "بدون فصل";

      if (!summaryMap[chapter]) {
        summaryMap[chapter] = {
          correct: 0,
          incorrect: 0,
          unanswered: 0,
          total: 0,
        };
      }

      if (!q.selectedOption) {
        summaryMap[chapter].unanswered++;
      } else if (q.answer === q.selectedOption) {
        summaryMap[chapter].correct++;
      } else {
        summaryMap[chapter].incorrect++;
      }
      summaryMap[chapter].total++;
    });

    const summary = Object.entries(summaryMap).map(([chapter, stats]) => ({
      chapter,
      ...stats,
      percentage: claculatePercent(
        stats.correct,
        stats.incorrect,
        stats.unanswered
      ),
    }));

    setChapterSummary(summary);
  };

  // const handleSaveAnalysis = async (analysis: IQuestionAnalysis) => {
  //   if (!selectedQuestion || !exam) return;

  //   setIsAnlisSaving(true);
  //   try {
  //     const updatedQuestions = exam.questions.map((q) =>
  //       q.number === selectedQuestion.number ? { ...q, analysis } : q
  //     );

  //     await axios.put(`/api/exams/${examID}`, {
  //       questions: updatedQuestions,
  //     });

  //     setExam({ ...exam, questions: updatedQuestions });
  //     extractChaptersAndTopics({ ...exam, questions: updatedQuestions });
  //     calculateChapterSummary({ ...exam, questions: updatedQuestions });

  //     const nextQuestion = getNextQuestion(selectedQuestion.number);
  //     if (nextQuestion) openAnalysisModal(nextQuestion);
  //   } catch (error) {
  //     toast.current?.show({
  //       severity: "error",
  //       summary: "خطا",
  //       detail: "ذخیره تحلیل با خطا مواجه شد",
  //       life: 3000,
  //     });
  //   } finally {
  //     setIsAnlisSaving(false);
  //   }
  // };

  const openAnalysisModal = (question: IQuestion) => {
    setSelectedQuestion(question);
    setShowAnalysisModal(true);
  };

  const getNextQuestion = (currentQuestionNumber: number) =>
    exam?.questions.find((q) => q.number === currentQuestionNumber + 1);

  const getTooltipContent = (question: IQuestion) => {
    const chapterStats = chapterSummary.find(
      (c) => c.chapter === question.analysis?.chapter
    );

    return (
      <div className="text-xs p-2 space-y-1 min-w-[200px]">
        <div className="text-slate-800 dark:!text-white text-center">
          {question.analysis?.chapter || "ثبت نشده"}
        </div>

        {question.analysis?.topic && (
          <div className="text-slate-800 dark:!text-white text-center">
            {question.analysis.topic}
          </div>
        )}

        {chapterStats && (
          <>
            <div className="border-t my-1"></div>
            <div className="flex justify-between text-green-600">
              <span>صحیح:</span>
              <span>{chapterStats.correct}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>غلط:</span>
              <span>{chapterStats.incorrect}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>نزده:</span>
              <span>{chapterStats.unanswered}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>درصد:</span>
              <span>
                {claculatePercent(
                  chapterStats.correct,
                  chapterStats.incorrect,
                  chapterStats.unanswered
                ).toFixed(2)}
                %
              </span>
            </div>
          </>
        )}

        {question.analysis?.description && (
          <>
            <div className="border-t my-1"></div>
            <div className="line-clamp-3 text-slate-800 dark:!text-white text-center">
              {question.analysis.description}
            </div>
          </>
        )}
      </div>
    );
  };

  if (!exam) return <Loader />;
  // return <Button onClick={fetchExam}>Clcik</Button>;

  return (
    <div
      className=" min-h-screen w-screen h-screen overflow-hidden transition-colors duration-300"
      dir="ltr"
    >
      <Toast ref={toast} position="top-left" />
      <div className="max-w-7xl mx-auto print:!overflow-visible">
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
        </div>

        {/* Questions Container */}
        <div className="flex pt-6 pb-28 overflow-y-scroll gap-6 flex-wrap justify-center items-center h-[calc(100vh-5rem)]">
          {/* Percent */}
          <div className="w-full">
            <div className="border flex justify-evenly p-7 text-3xl text-green-500 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* <Button
                severity="info"
                onClick={() => setshowExportModal(true)}
                className="!bg-green-500 !text-white px-8 py-3 rounded-lg hover:!bg-green-600 transition-colors text-lg"
              >
                خروجی
              </Button> */}
              <span>%{participant?.percent?.toFixed(2)}</span>
              {/* <Button
                severity="info"
                onClick={() => setshowDetails((prev) => !prev)}
                className="!bg-green-500 !text-white px-8 py-3 rounded-lg hover:!bg-green-600 transition-colors text-lg"
              >
                جزئیات
              </Button> */}
            </div>
          </div>

          {participant?.answers &&
            Array(Math.ceil(participant?.answers?.length / 10 || 0))
              .fill(0)
              .map((_, i) => {
                const questions = participant?.answers.slice(
                  10 * i,
                  10 * i + 10
                );
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
                      {participant?.answers
                        .slice(10 * i, 10 * i + 10)
                        .map((question, j) => (
                          <div
                            key={`${i}-${j}`}
                            id={`question${question.number}`}
                          >
                            <div className="flex items-center group">
                              {/* <Tooltip
                              id={`tooltip-${question.number}`}
                              className="!bg-transparent glass-effect rounded-md"
                              target={`#question${question.number}`}
                              mouseTrack
                            >
                              {getTooltipContent(question)}
                            </Tooltip> */}
                              <ExamResultQuestionRow question={question} />
                              <button
                                onClick={() => openAnalysisModal(question)}
                                className="ml-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <PencilSquareIcon className="w-5 h-5" />
                              </button>
                            </div>
                            {/* {showDetails && (
                            <div className="border-b-2 border-black/20">
                              {getTooltipContent(question)}
                            </div>
                          )} */}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}

          {/* Chapter Summary */}
          <div className="w-full mt-6">
            <ChapterSummaryTable chapters={chapterSummary} />
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      {/* {selectedQuestion && (
        <>
          <QuestionAnalysisModal
            question={selectedQuestion}
            visible={showAnalysisModal}
            onHide={() => setShowAnalysisModal(false)}
            onSave={handleSaveAnalysis}
            chapters={chapters}
            topics={topics}
            isLoading={isAnlisSaving}
          />
        </>
      )} */}

      {/* <ExportModal
        onHide={() => setshowExportModal(false)}
        visible={showExportModal}
        exam={exam}
      /> */}
    </div>
  );
};

export default GroupExamResultPage;
