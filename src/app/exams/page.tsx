// Exams.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { IntermediateExam } from "@/models/Exam";
import ExamCard from "@/components/layout/ExamCard";
import CreateExamForm from "@/components/CreateExamForm";
import { PrimeIcons } from "primereact/api";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/Loader";

export default function Exams() {
  const [exams, setExams] = useState<IntermediateExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const session = useSession();

  const fetchExams = async () => {
    try {
      const { data } = await axios.get("/api/exams");
      setExams(data);
    } catch (error) {
      showError("خطا در دریافت اطلاعات آزمون‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      if (session.status !== "loading" && !session.data) {
        router.push("/auth/signin");
      } else {
        fetchExams();
      }
    };

    checkSession();
  }, [session]);

  const handleDeleteExam = async (examId: string) => {
    try {
      await axios.delete(`/api/exams/${examId}`);
      setExams(exams.filter((exam) => exam._id !== examId));
      showSuccess("آزمون با موفقیت حذف شد");
    } catch (error) {
      showError("خطا در حذف آزمون");
    }
  };

  const handleToggleViewed = async (examId: string) => {
    try {
      await axios.put(`/api/exams/${examId}`, {
        viewed: !exams.find((t) => t._id === examId)?.viewed,
      });
      setExams(
        exams.map((t) => (t._id === examId ? { ...t, viewed: !t.viewed } : t))
      );
    } catch (error) {
      showError("خطا در بروزرسانی وضعیت");
    }
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "خطا",
      detail: message,
      life: 3000,
    });
  };

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "موفق",
      detail: message,
      life: 3000,
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Toast ref={toast} position="top-left" />

        {/* Header */}
        <div className="flex justify-between items-center mb-12 glass-panel p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            مدیریت آزمون‌ها
          </h1>
          <Button
            icon={<PlusIcon className="!text-white" />}
            className="!bg-blue-600 hover:!bg-blue-700 !border-0"
            onClick={() => setShowCreateModal(true)}
          />
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard
              key={exam._id}
              exam={exam}
              onDelete={handleDeleteExam}
              onViewedToggle={handleToggleViewed}
            />
          ))}
        </div>

        {/* Create Exam Dialog */}
        <Dialog
          header="ایجاد آزمون جدید"
          visible={showCreateModal}
          style={{ width: "90vw", maxWidth: "600px" }}
          onHide={() => setShowCreateModal(false)}
          draggable={true}
          className="glass-panel"
        >
          <CreateExamForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchExams();
              showSuccess("آزمون جدید با موفقیت ایجاد شد");
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}
