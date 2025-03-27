"use client";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { IntermediateExam } from "@/models/Exam";
import ExamCard from "@/components/layout/ExamCard";
import CreateExamForm from "@/components/CreateExamForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/Loader";
import GroupExamCard from "@/components/layout/GroupExamCard";
import { InputSwitch } from "primereact/inputswitch";

// کامپوننت اصلی که از useSearchParams استفاده می‌کند
function ExamsContent() {
  const [exams, setExams] = useState<IntermediateExam[]>([]);
  const [groupExams, setGroupExams] = useState<IntermediateExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();

  // Parse Query Parameters
  const tagsFromUrl = searchParams.get("tags")?.split(",") || [];
  const filterTypeFromUrl = searchParams.get("filterType") || "intersection";
  const [tags, setTags] = useState<string[]>([]);

  const fetchExams = async () => {
    try {
      const { data } = await axios.get("/api/exams");
      setExams(data.exams);
      setTags(data.user.examTags.reverse());
    } catch (error) {
      showError("خطا در دریافت اطلاعات آزمون‌ها");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupExams = async () => {
    const res = await axios.get("/api/exams/group/participant");
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

  const filteredExams = useMemo(() => {
    console.log(tagsFromUrl);
    if (!tagsFromUrl.length || !tagsFromUrl.join("")) {
      return exams;
    }

    return exams.filter((e) => {
      const words = e.title.replace(/\s+/g, " ").trim().split(" ");
      return filterTypeFromUrl === "union"
        ? tagsFromUrl.some((tag) => words.includes(tag))
        : tagsFromUrl.every((tag) => words.includes(tag));
    });
  }, [tagsFromUrl, filterTypeFromUrl, exams]);

  const handleToggleTag = (tag: string) => {
    const newTags = (
      tagsFromUrl.includes(tag)
        ? tagsFromUrl.filter((t) => t !== tag)
        : [...tagsFromUrl, tag]
    ).filter((item) => item !== "");

    if (newTags.join(",") !== tagsFromUrl.join(",")) {
      const query = new URLSearchParams({
        tags: newTags.join(","),
        filterType: filterTypeFromUrl,
      });

      router.push(`?${query.toString()}`);
    }
  };

  const handleFilterTypeChange = (type: string) => {
    if (type !== filterTypeFromUrl) {
      const query = new URLSearchParams({
        tags: tagsFromUrl.join(","),
        filterType: type,
      });

      router.push(`?${query.toString()}`);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await axios.delete(`/api/exams/${examId}`);
      setExams((prev) => prev.filter((exam) => exam._id !== examId));
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

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Toast ref={toast} position="top-left" />

        {/* Local Exams */}
        <section className="mb-20">
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
            <div className="flex gap-1 text-lg">
              ∪
              <InputSwitch
                checked={filterTypeFromUrl === "union"}
                onChange={(e) =>
                  handleFilterTypeChange(e.value ? "union" : "intersection")
                }
              />
              <span className="text-xl font-bold">∩</span>
            </div>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => handleToggleTag(t)}
                className={`py-1 px-3 mb-1 ${
                  tagsFromUrl.includes(t)
                    ? "bg-blue-600/30 text-blue-600 font-bold border-transparent"
                    : "bg-blue-600/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

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

        {/* Group Exams */}
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

// کامپوننت اصلی که Suspense boundary را پیاده‌سازی می‌کند
export default function Exams() {
  return (
    <Suspense fallback={<Loader />}>
      <ExamsContent />
    </Suspense>
  );
}