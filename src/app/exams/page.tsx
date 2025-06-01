"use client";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { IntermediateExam } from "@/models/Exam";
import ExamCard from "@/components/layout/ExamCard";
import CreateExamForm from "@/components/CreateExamForm";
import { ArrowLongLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/Loader";
import { InputSwitch } from "primereact/inputswitch";
import Pagination from "@/components/Pagination";
import Link from "next/link";

function ExamsContent() {
  const [exams, setExams] = useState<IntermediateExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();

  // Parse Query Parameters
  const tagsFromUrl = useMemo(
    () => searchParams.get("tags")?.split(",").filter(Boolean) || [],
    [searchParams]
  );
  const filterTypeFromUrl = useMemo(
    () => searchParams.get("filterType") || "intersection",
    [searchParams]
  );
  const paginationNumber = useMemo(
    () => Number(searchParams.get("page") || 1),
    [searchParams]
  );
  const paginationLimit = useMemo(
    () => Number(searchParams.get("limit") || 10),
    [searchParams]
  );
  const [tags, setTags] = useState<string[]>([]);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/exams");
      setExams(data.exams);
      setTags(data.user?.examTags?.reverse() || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
      setError("خطا در دریافت اطلاعات آزمون‌ها");
      showError("خطا در دریافت اطلاعات آزمون‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session.status === "authenticated") {
      Promise.all([fetchExams()]).catch(console.error);
    }
  }, [session.status, router, fetchExams]);

  const filteredExams = useMemo(() => {
    if (!tagsFromUrl.length) {
      return exams;
    }

    return exams.filter((e) => {
      const words = e.title.replace(/\s+/g, " ").trim().split(" ");
      return filterTypeFromUrl === "union"
        ? tagsFromUrl.some((tag) => words.includes(tag))
        : tagsFromUrl.every((tag) => words.includes(tag));
    });
  }, [tagsFromUrl, filterTypeFromUrl, exams]);

  const paginatedExams = useMemo(() => {
    const startIndex = (paginationNumber - 1) * paginationLimit;
    return filteredExams.slice(startIndex, startIndex + paginationLimit);
  }, [filteredExams, paginationNumber, paginationLimit]);

  const handleToggleTag = useCallback(
    (tag: string) => {
      const newTags = tagsFromUrl.includes(tag)
        ? tagsFromUrl.filter((t) => t !== tag)
        : [...tagsFromUrl, tag];

      const query = new URLSearchParams({
        tags: newTags.join(","),
        filterType: filterTypeFromUrl,
        page: String(paginationNumber),
        limit: String(paginationLimit),
      });

      router.push(`?${query.toString()}`);
    },
    [tagsFromUrl, filterTypeFromUrl, paginationNumber, paginationLimit, router]
  );

  const handleFilterTypeChange = useCallback(
    (type: string) => {
      const query = new URLSearchParams({
        tags: tagsFromUrl.join(","),
        filterType: type,
        page: String(paginationNumber),
        limit: String(paginationLimit),
      });

      router.push(`?${query.toString()}`);
    },
    [tagsFromUrl, paginationNumber, paginationLimit, router]
  );

  const handleDeleteExam = useCallback(async (examId: string) => {
    try {
      await axios.delete(`/api/exams/${examId}`);
      setExams((prev) => prev.filter((exam) => exam._id !== examId));
      showSuccess("آزمون با موفقیت حذف شد");
    } catch (err) {
      console.error("Failed to delete exam:", err);
      showError("خطا در حذف آزمون");
    }
  }, []);

  const handleToggleViewed = useCallback(
    async (examId: string) => {
      try {
        const exam = exams.find((t) => t._id === examId);
        if (!exam) return;

        await axios.put(`/api/exams/${examId}`, {
          viewed: !exam.viewed,
        });

        setExams((prev) =>
          prev.map((t) => (t._id === examId ? { ...t, viewed: !t.viewed } : t))
        );
      } catch (err) {
        console.error("Failed to update exam view status:", err);
        showError("خطا در بروزرسانی وضعیت");
      }
    },
    [exams]
  );

  const showError = useCallback((message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "خطا",
      detail: message,
      life: 3000,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "موفق",
      detail: message,
      life: 3000,
    });
  }, []);

  if (loading) return <Loader />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Toast ref={toast} position="top-left" />

        {/* Local Exams */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8 md:mb-12 glass-panel p-4 md:p-6">
            <div className="flex gap-3">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مدیریت آزمون‌ها
              </h1>
              <Link href="/exams/group">
                <Button icon={<ArrowLongLeftIcon width={30} />} />
              </Link>
            </div>
            <Button
              icon={<PlusIcon className="!text-white h-5 w-5" />}
              className="!bg-blue-600 hover:!bg-blue-700 !border-0 !p-2 md:!p-3"
              onClick={() => setShowCreateModal(true)}
              aria-label="Create new exam"
            />
          </div>

          {/* Tags */}
          <div className="w-full flex overflow-x-auto mb-3 gap-1 px-3 py-2">
            <div className="flex gap-1 items-center text-lg mr-2">
              <span className="text-xl font-bold">∪</span>
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
                className={`py-1 px-3 mb-1 rounded-md whitespace-nowrap ${
                  tagsFromUrl.includes(t)
                    ? "bg-blue-600/30 text-blue-600 font-bold border-transparent"
                    : "bg-blue-600/10 hover:bg-blue-600/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {paginatedExams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              هیچ آزمونی یافت نشد
            </div>
          ) : (
            <div className="flex w-full relative">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedExams.map((exam) => (
                  <ExamCard
                    key={exam._id}
                    exam={exam}
                    onDelete={handleDeleteExam}
                    onViewedToggle={handleToggleViewed}
                  />
                ))}
              </div>
              <div>
                <Pagination
                  totalItems={filteredExams.length}
                  currentPage={paginationNumber}
                  itemsPerPage={paginationLimit}
                  onPageChange={(page, limit) => {
                    const query = new URLSearchParams({
                      tags: tagsFromUrl.join(","),
                      filterType: filterTypeFromUrl,
                      page: String(page),
                      limit: String(limit),
                    });
                    router.push(`?${query.toString()}`);
                  }}
                  itemsPerPageOptions={[5, 10, 25, 50]}
                />
              </div>
            </div>
          )}
        </section>

        <Dialog
          header="ایجاد آزمون جدید"
          visible={showCreateModal}
          style={{ width: "90vw", maxWidth: "600px" }}
          onHide={() => setShowCreateModal(false)}
          draggable={false}
          className="glass-panel"
          modal
        >
          <CreateExamForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchExams();
              showSuccess("آزمون جدید با موفقیت ایجاد شد");
            }}
            // onError={(message) => showError(message)}
          />
        </Dialog>
      </div>
    </div>
  );
}

export default function Exams() {
  return (
    <Suspense fallback={<Loader />}>
      <ExamsContent />
    </Suspense>
  );
}
