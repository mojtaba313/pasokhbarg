// components/CreateTestModal.tsx
"use client";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CreateTestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTestModal({
  open,
  onClose,
}: CreateTestModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    loading: false,
    error: "",
  });
  const [startQuestion, setStartQuestion] = useState('0');
  const [endQuestion, setEndQuestion] = useState('10');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, loading: true, error: "" }));
    if(!startQuestion || !endQuestion) return;
    
    const sortedNumbers = [Math.floor(Number(startQuestion)),Math.floor(Number(endQuestion))].sort(
      (a, b) => a - b
    );

    try {
      const { data } = await axios.post("/api/tests", {
        title: formData.title,
        startQuestion: sortedNumbers[0],
        endQuestion: sortedNumbers[1],
      });

      router.push(`/test/${data._id}`);
      onClose();
    } catch (error: any) {
      setFormData((prev) => ({
        ...prev,
        error: error.response?.data?.message || "خطایی رخ داده است",
        loading: false,
      }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">ایجاد آزمون جدید</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-1 text-sm text-gray-600 dark:text-gray-300"
                >
                  عنوان آزمون
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full p-2 border dark:bg-gray-700 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={50}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startQuestion"
                    className="block mb-1 text-sm text-gray-600 dark:text-gray-300"
                  >
                    شماره سوال شروع
                  </label>
                  <input
                    type="number"
                    id="startQuestion"
                    value={startQuestion}
                    onChange={(e) =>
                      setStartQuestion(e.target.value)
                    }
                    className="w-full p-2 border dark:bg-gray-700 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="endQuestion"
                    className="block mb-1 text-sm text-gray-600 dark:text-gray-300"
                  >
                    شماره سوال پایان
                  </label>
                  <input
                    type="number"
                    id="endQuestion"
                    value={endQuestion}
                    onChange={(e) =>
                      setEndQuestion(e.target.value)
                    }
                    className="w-full p-2 border dark:bg-gray-700 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {formData.error && (
                <div className="text-red-500 text-sm mt-2">
                  {formData.error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={formData.loading}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {formData.loading ? "در حال ایجاد..." : "ایجاد آزمون"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
