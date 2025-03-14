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
import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/Loader";
import { foramttHour } from "@/utils/funcs";

export default function GroupExamsPage() {
  const [exams, setExams] = useState<IGroupExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const fetchExams = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/exams/group");
    if (res.status === 200) setExams(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

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
        const res = await axios.put("/api/exams/group", {
          examId,
          action: "toggle-active",
        });
        console.log(res);
        if (res.status === 200) fetchExams();
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
        label="شروع آزمون"
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

  if (isLoading) return <Loader />;
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">مدیریت آزمون‌های جمعی</h1>
        <Button
          label="ایجاد آزمون جدید"
          className="text-slate-950 dark:text-white"
          icon="pi pi-plus"
          onClick={() => setShowCreateModal(true)}
        />
      </div>
      <div className="glass-effect p-4 rounded-lg">
        <DataTable value={exams}>
          <Column field="title" header="عنوان" />
          <Column field="startTime" header="زمان شروع" />
          <Column field="endTime" header="زمان پایان" />
          <Column
            field="spentTime"
            header="زمان سپری شده"
            body={timeSpentTemplate}
          />
          <Column body={statusBodyTemplate} />
          <Column body={removeBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header="ایجاد آزمون جمعی"
        visible={showCreateModal}
        style={{ width: "50vw" }}
        onHide={() => setShowCreateModal(false)}
      >
        <CreateGroupExamForm
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
