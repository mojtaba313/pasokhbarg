"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CreateGroupExamForm from "@/components/admin/CreateGroupExamForm";
import axios from "axios";
import { IGroupExam } from "@/models/GroupExam";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  ArrowLongLeftIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "@/components/Loader";
import { foramttHour } from "@/utils/funcs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IUser } from "@/models/User";
import { useSession } from "next-auth/react";

export default function GroupExamsPage() {
  const [exams, setExams] = useState<IGroupExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subsets, setSubsets] = useState<IUser[]>([]);
  const [isFetchingSubsets, setIsFetchingSubsets] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const router = useRouter();
  const { data: session } = useSession();

  const fetchExams = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/exams/group");
    if (res.status === 200) setExams(res.data);
    setIsLoading(false);
  };
  const fetchSubsets = async () => {
    setIsFetchingSubsets(true);
    const res = await axios.get(
      `/api/admin/users?adminId=${session?.user?._id}`
    );
    setIsFetchingSubsets(false);
    if (res.status === 200) setSubsets(res.data);
  };

  useEffect(() => {
    fetchExams();
    fetchSubsets();
  }, [session]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleExamAction = async (examId: string) => {
    confirmDialog({
      message: "آیا مطمئنید ؟؟",
      header: "تاییدیه",
      icon: <ExclamationCircleIcon width={30} />,
      accept: async () => {
        const res = await axios.put(`/api/exams/group/${examId}`, {
          action: "toggle-active",
        });
        fetchExams();
      },
    });
  };

  const handleDeleteExam = async (examId: string) => {
    confirmDialog({
      message: "آیا مطمئنید که می‌خواهید این آزمون را حذف کنید؟",
      header: "تاییدیه حذف",
      icon: <ExclamationCircleIcon width={30} />,
      accept: async () => {
        const res = await axios.delete(`/api/exams/group/${examId}`);
        console.log(res);
        if (res.status === 200) fetchExams();
      },
    });
  };

  const statusBodyTemplate = (rowData: IGroupExam) =>
    !rowData.startTime ? (
      <Button
        label="شروع"
        className="!bg-green-400 !text-green-600"
        onClick={() => handleExamAction(rowData._id)}
      />
    ) : !rowData.endTime ? (
      <Button
        label="توقف آزمون"
        className="!bg-red-400 !text-red-600"
        onClick={() => handleExamAction(rowData._id)}
      />
    ) : (
      <Button
        label="آزمون پایان یافته"
        className="!bg-gray-400 !text-gray-600"
        onClick={() => handleExamAction(rowData._id)}
        disabled
      />
    );

  const timeSpentTemplate = ({ startTime, endTime }: IGroupExam) =>
    !startTime
      ? ""
      : endTime
      ? foramttHour(
          Math.floor(
            (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
          )
        )
      : foramttHour(Math.floor((now - new Date(startTime).getTime()) / 1000));

  const removeBodyTemplate = (rowData: IGroupExam) => (
    <button onClick={() => handleDeleteExam(rowData._id)}>
      <TrashIcon width={30} className="text-red-500 hover:text-red-600" />
    </button>
  );

  const detailsBodyTemplate = (rowData: IGroupExam) => (
    <Link href={`/admin/exams/group/${rowData._id}/result`}>
      <ArrowLongLeftIcon
        width={30}
        className="text-blue-500 hover:text-blue-600"
      />
    </Link>
  );

  const answersBodyTemplate = (rowData: IGroupExam) => (
    <Link href={`/admin/exams/group/${rowData._id}/add-answers`}>
      <ClipboardDocumentCheckIcon
        width={30}
        className="text-green-500 hover:text-green-600"
      />
    </Link>
  );

  if (isLoading) return <Loader />;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 md:mb-12 glass-panel p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          مدیریت آزمون‌های جمعی
        </h1>
        <div className="flex gap-3">
          <Button
            className="text-white !bg-blue-600"
            icon={<PlusIcon width={30} />}
            onClick={() => setShowCreateModal(true)}
          />
          <Button icon={<ArrowPathIcon width={30} />} onClick={fetchExams} />
          <Button onClick={router.back}>
            <span className="px-2">بازگشت</span>
            <ArrowLongLeftIcon width={30} />
          </Button>
        </div>
      </div>

      <div className="glass-effect p-4 rounded-lg !overflow-hidden">
        <DataTable value={exams}>
          <Column field="title" header="عنوان" />
          <Column
            field="spentTime"
            header="زمان سپری شده"
            body={timeSpentTemplate}
          />
          <Column body={statusBodyTemplate} />
          <Column body={answersBodyTemplate} />
          <Column body={removeBodyTemplate} />
          <Column body={detailsBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header="ایجاد آزمون جمعی"
        visible={showCreateModal}
        style={{ width: "50vw" }}
        onHide={() => setShowCreateModal(false)}
        headerClassName="!text-slate-950 dark:!text-white"
      >
        <CreateGroupExamForm
          isFetchingSubsets={isFetchingSubsets}
          subsets={subsets}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchExams();
          }}
        />
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
