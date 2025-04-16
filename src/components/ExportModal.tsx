// components/ExportModal.tsx
"use client";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";

interface ExportModalProps {
  exam: any;
  visible: boolean;
  onHide: () => void;
}

export default function ExportModal({
  exam,
  visible,
  onHide,
}: ExportModalProps) {
  return (
    <Dialog
      header="خروجی"
      visible={visible}
      style={{ width: "90vw", maxWidth: "500px" }}
      onHide={onHide}
      className="glass-panel *:!text-gray-200 overflow-hidden"
    >
      <div className="flex flex-col gap-4">
        <InputTextarea value={JSON.stringify(exam)} dir="ltr" readOnly className="min-h-44"></InputTextarea>
      </div>
    </Dialog>
  );
}
