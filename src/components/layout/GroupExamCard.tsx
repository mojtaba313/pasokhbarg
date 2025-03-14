// ExamCard.tsx
import { IExam, IntermediateExam } from "@/models/Exam";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import Link from "next/link";
import { formatDate } from "@/utils/funcs";
import {
  ClipboardDocumentListIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Timer from "../Timer";

interface Props {
  exam: IntermediateExam;
  onJoid: (examId: string) => void;
}

const GroupExamCard = ({ exam, onJoid }: Props) => {
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const iconInfos = !exam.startTime
    ? {
        title: "هنوز زمان آزمون فرانرسیده",
        className: "text-blue-500",
        status: "notStarted",
        elem: (
          <ClipboardDocumentListIcon width={30} className="!text-green-500" />
        ),
      }
    : !exam.endTime
    ? {
        title: "در حال اجرا",
        className: "text-green-500",
        status: "running",
        elem: <PlayIcon width={30} className="text-green-500" />,
        onClick: () => onJoid(exam._id),
      }
    : {
        title: "پایان یافته",
        className: "text-red-500",
        status: "finished",
        elem: (
          <ClipboardDocumentListIcon width={30} className="text-green-500" />
        ),
        onClick: () => router.push(`/exams/group/${exam._id}/result`),
      };

  const header = (
    <div className="glass-effect h-32 relative rounded-lg overflow-hidden">
      <div className="absolute glass-effect inset-0 bg-white/20 backdrop-blur-sm flex justify-center items-center " />
      <div className="relative p-4 flex justify-center items-center text-slate-950 dark:text-white h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3">{exam.title}</h2>
          <p className="text-sm">
            {exam.startTime && formatDate(exam.startTime)} -{" "}
            {exam.questions.length} سوال
          </p>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="grid grid-cols-2 gap-4 text-center text-slate-800">
      <div className="glass-panel p-3">
        <p className="text-sm mb-1">شماره سوالات</p>
        <p className="font-bold">
          {exam.startQuestion} - {exam.endQuestion}
        </p>
      </div>
      <div className="glass-panel p-3">
        <p className="text-sm mb-1">وضعیت</p>
        <p className={`font-bold ${iconInfos.className}`}>{iconInfos.title}</p>
      </div>
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="!bg-white/10 dark:!bg-gray-800/50 !backdrop-blur-3xl  !border-none !shadow-lg hover:!shadow-xl transition-all h-full"
    >
      <Toast ref={toast} position="bottom-center" />
      <div className="flex justify-center items-center w-full h-full gap-3">
        <Button
          icon={iconInfos.elem}
          rounded
          severity="secondary"
          onClick={iconInfos.onClick}
          className={iconInfos.className}
        />
        {iconInfos.status === "running" && (
          <Timer startTime={exam.startTime as Date} noIcon />
        )}
      </div>
    </Card>
  );
};

export default GroupExamCard;
