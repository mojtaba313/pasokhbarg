// components/ConfirmModal.tsx
"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-500/10 rounded-lg hover:bg-gray-200"
            >
              لغو
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
