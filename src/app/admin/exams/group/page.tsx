// app/admin/exams/group/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CreateGroupExamForm from "@/components/admin/CreateGroupExamForm";
import { IExam } from "@/models/Exam";

export default function GroupExamsPage() {
  const { data: session } = useSession();
  const [exams, setExams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetch("/api/exams/group")
      .then((res) => res.json())
      .then((data) => setExams(data));
  }, []);

  const handleExamAction = (examId: string, status: IExam["status"]) => {};

  const fetchExams = () => {};

  const statusBodyTemplate = (rowData: IExam) => {
    const statusColors = {
      planned: "bg-blue-500",
      active: "bg-green-500",
      finished: "bg-red-500",
    };
    return (
      <span
        className={`${
          statusColors[rowData.status]
        } text-white px-2 py-1 rounded`}
      >
        {rowData.status === "planned" && "برنامه‌ریزی شده"}
        {rowData.status === "active" && "فعال"}
        {rowData.status === "finished" && "پایان یافته"}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">مدیریت آزمون‌های جمعی</h1>
        <Button
          label="ایجاد آزمون جدید"
          icon="pi pi-plus"
          onClick={() => setShowCreateModal(true)}
        />
      </div>

      <DataTable value={exams}>
        <Column field="title" header="عنوان" />
        <Column field="startTime" header="زمان شروع" />
        <Column field="endTime" header="زمان پایان" />
        <Column field="status" header="وضعیت" body={statusBodyTemplate} />
        <Column
          body={(rowData: IExam) => (
            <Button
              className="text-!white"
              label={rowData.status === "active" ? "توقف آزمون" : "شروع آزمون"}
              severity={rowData.status === "active" ? "danger" : "success"}
              onClick={() =>
                handleExamAction(rowData._id as string, rowData.status)
              }
            />
          )}
        />
      </DataTable>

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
    </div>
  );
}
