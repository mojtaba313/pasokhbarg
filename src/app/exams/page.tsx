"use client";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import CreateExamModal from "@/components/CreateExamModal";
import ConfirmModal from "@/components/ConfirmModal";
import { IExam, IntermediateExam } from "@/models/Exam";
import { Loader } from "@/components/Loader";
import { useSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export default function Exams() {
  const [exams, setExams] = useState<IntermediateExam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const checkSession = async () => {
      if (session.status !== "loading" && !session.data) {
        router.push("/auth/signin");
      } else {
        fetchExams();
      }
    };

    const fetchExams = async () => {
      console.log("session", session);
      const { data } = await axios.get("/api/exams");
      setExams(data);
      setIsLoading(false);
    };

    checkSession();
  }, [session]);

  const handleDeleteExam = async () => {
    if (!examToDelete) return;

    try {
      await axios.delete(`/api/exams/${examToDelete}`);
      setExams(exams.filter((exam) => exam._id !== examToDelete));
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Failed to delete exam:", error);
    }
  };

  const handleToggleViewed: any = async (examId: string) => {
    try {
      await axios.put(`/api/exams/${examId}`, {
        viewed: !exams.find((t) => t._id === examId)?.viewed,
      });
      setExams(
        exams.map((t) => (t._id === examId ? { ...t, viewed: !t.viewed } : t))
      );
    } catch (error) {
      console.error("خطا در بروزرسانی وضعیت رویت:", error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            آزمون‌های من
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/50"
            >
              <PlusIcon className="w-5 h-5" />
              آزمون جدید
            </button>
            {/* دکمه Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-500/50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              خروج
            </button>
          </div>
        </div>

        {/* لیست آزمون‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative group"
            >
              <div className="absolute bottom-4 left-4 flex flex-col items-end">
                <Link href={`/exams/${exam._id}/add-answers`}>
                  <DocumentCheckIcon
                    width={30}
                    className="text-green-500 m-2 hover:text-green-600"
                  />
                </Link>
                <label className="flex gap-2 cursor-pointer">
                  رویت شده :
                  <div className="flex items-center relative">
                    <input
                      type="checkbox"
                      checked={exam.viewed}
                      onChange={() => handleToggleViewed(exam._id)}
                      className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-600 checked:border-blue-600"
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
                </label>
              </div>
              {/* دکمه حذف */}
              <button
                onClick={() => {
                  setExamToDelete(exam._id);
                  setShowConfirmModal(true);
                }}
                className="absolute top-4 left-4 p-2 text-red-500 hover:text-red-600 transition-opacity duration-300"
              >
                <TrashIcon className="w-6 h-6" />
              </button>

              {/* محتوای کارت */}
              <Link href={`/exams/${exam._id}/result`}>
                <DocumentTextIcon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {exam.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  سوالات {exam.startQuestion} تا {exam.endQuestion}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(exam.startTime).toLocaleDateString("fa-IR")}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* مودال ایجاد آزمون */}
        <CreateExamModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        {/* مودال تأیید حذف */}
        <ConfirmModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteExam}
          title="حذف آزمون"
          description="آیا مطمئن هستید که می‌خواهید این آزمون را حذف کنید؟ این عمل برگشت‌ناپذیر است."
        />
      </div>
    </div>
  );
}
