// ExamCard.tsx
import { IntermediateExam } from "@/models/Exam";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import Link from "next/link";
import { formatDate } from "@/utils/funcs";
import {
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  KeyIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "primereact/tooltip";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  exam: IntermediateExam;
  onDelete: (examId: string) => void;
  onViewedToggle: (examId: string) => void;
}

const ExamCard = ({ exam, onDelete, onViewedToggle }: Props) => {
  const toast = useRef<Toast>(null);
  const isExamPassed = Boolean(exam.endTime);
  const isStarted = Boolean(exam.startTime);
  const router = useRouter();

  const hanldeStartExam = async () => {
    const res = await axios.post(`/api/exams/${exam._id}`);
    if (res.status === 200) router.push(`/exams/${exam._id}`);
  };

  const header = (
    <div className="glass-effect h-32 relative rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex justify-center items-center " />
      <div className="relative p-4 flex justify-center items-center text-slate-950 dark:text-white h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3">{exam.title}</h2>
          <p className="text-sm">
            {isStarted ? formatDate(exam.startTime || new Date()) : ""}-{" "}
            {exam.questions.length} سوال
          </p>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-between items-center">
      <Tooltip target=".logo" mouseTrack mouseTrackLeft={10} position="left">
        تغییر وضعیت تایید
      </Tooltip>
      <div className="logo flex items-center relative cursor-pointer">
        <input
          type="checkbox"
          checked={exam.viewed}
          onChange={() => onViewedToggle(exam._id)}
          className="view-check-box peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-600 checked:border-blue-600"
          id="check1"
        />
        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          icon={
            <TrashIcon
              width={20}
              className="!text-red-500 hover:!text-red-600"
            />
          }
          rounded
          onClick={(e) => {
            toast.current?.show({
              sticky: true,
              content: (
                <div className="flex w-full gap-2 items-center">
                  <ExclamationCircleIcon width={20} className="text-red-500" />
                  <p>از حذف مطمئنی ؟؟!</p>
                  <div className="flex">
                    <Button
                      className="!bg-red-500 text-white"
                      color="red"
                      onClick={() => onDelete(exam._id)}
                    >
                      آره
                    </Button>
                  </div>
                </div>
              ),
            });
          }}
        />
        {isExamPassed ? (
          <Link href={`/exams/${exam._id}/result`}>
            <Button
              icon={
                <ClipboardDocumentListIcon
                  width={20}
                  className="text-green-500"
                />
              }
              rounded
              severity="secondary"
            />
          </Link>
        ) : (
          <Button
            icon={<PlayIcon width={20} className="!text-green-500" />}
            rounded
            severity="secondary"
            onClick={hanldeStartExam}
          />
        )}
        <Link href={`/exams/${exam._id}/add-answers`}>
          <Button
            icon={<KeyIcon width={20} className="!text-yellow-500" />}
            rounded
            severity="secondary"
          />
        </Link>
      </div>
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="!bg-white/10 dark:!bg-gray-800/50 !backdrop-blur-3xl  !border-none !shadow-lg hover:!shadow-xl transition-all hover:scale-[1.02 h-full"
    >
      <Toast ref={toast} position="bottom-center" />
      <div className="grid grid-cols-2 gap-4 text-center text-slate-800">
        <div className="glass-panel p-3">
          <p className="text-sm mb-1">شماره سوالات</p>
          <p className="font-bold">
            {exam.startQuestion} - {exam.endQuestion}
          </p>
        </div>
        <div className="glass-panel p-3">
          <p className="text-sm mb-1">وضعیت</p>
          <p
            className={`font-bold ${
              isStarted
                ? isExamPassed
                  ? "text-green-400"
                  : "text-amber-400"
                : "text-blue-500"
            }`}
          >
            {isStarted
              ? isExamPassed
                ? "اجرا شده"
                : "در انتظار اجرا"
              : "در حال اجرا"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ExamCard;
