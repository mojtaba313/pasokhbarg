// Exams.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { IntermediateExam } from "@/models/Exam";
import ExamCard from "@/components/layout/ExamCard";
import CreateExamForm from "@/components/CreateExamForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/Loader";
import GroupExamCard from "@/components/layout/GroupExamCard";

export default function Exams() {
  const [filteredExams, setfilteredExams] = useState<IntermediateExam[]>([]);
  const [exams, setExams] = useState<IntermediateExam[]>([]);
  const [groupExams, setGroupExams] = useState<IntermediateExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const session = useSession();
  const [tags, setTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const fetchExams = async () => {
    try {
      const { data } = await axios.get("/api/exams");
      setExams(data.exams);
      setTags(data.user.examTags);
    } catch (error) {
      showError("خطا در دریافت اطلاعات آزمون‌ها");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupExams = async () => {
    const res = await axios.get("/api/exams/group/participant");
    console.log(res);
    if (res.status === 200) setGroupExams(res.data);
  };

  useEffect(() => {
    const checkSession = async () => {
      if (session.status !== "loading" && !session.data) {
        router.push("/auth/signin");
      } else {
        fetchExams();
        fetchGroupExams();
      }
    };

    checkSession();
  }, [session]);

  useEffect(() => {
    if (!activeTags.length) setfilteredExams(exams);
    const news = exams.filter((e) =>
      e.title
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .some((s) => activeTags.includes(s))
    );
    setfilteredExams(news);
    console.log(news)
  }, [activeTags]);

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

  const handleJoinExam = async (examId: string) => {
    const res = await axios.post(`/api/exams/group/${examId}/participant`);
    if (res.status === 200) {
      router.push(`/exams/group/${examId}`);
    }
  };

  const toggleTagActivation = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Toast ref={toast} position="top-left" />

        {/* Local Exams */}
        <section className="mb-20">
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

          {/* Tags */}
          <div className="w-full flex overflow-x-scroll mb-3 gap-1 px-3">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => toggleTagActivation(t)}
                className={`py-1 px-3 mb-1 ${
                  activeTags.includes(t)
                    ? "bg-blue-600/30 text-blue-600 font-bold border-transparent"
                    : "bg-blue-600/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam._id}
                exam={exam}
                onDelete={handleDeleteExam}
                onViewedToggle={handleToggleViewed}
              />
            ))}
          </div>
        </section>

        {/* Group Exmas */}
        <section>
          <div className="flex justify-between items-center mb-12 glass-panel p-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              آزمون های دسته جمعی
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupExams?.map((exam) => (
              <GroupExamCard
                key={exam._id}
                exam={exam}
                onJoid={handleJoinExam}
              />
            ))}
          </div>
        </section>

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
