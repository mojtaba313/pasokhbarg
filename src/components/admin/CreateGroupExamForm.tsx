// components/admin/CreateGroupExamForm.tsx
"use client";
import { FormEvent, useState } from "react";
import { Button } from "primereact/button";
import { IUser } from "@/models/User";
import Spinner from "../Spinner";
import { MultiSelect } from "../ui/MultiSelect";

interface Props {
  onSuccess: () => void;
  isFetchingSubsets: boolean;
  subsets: IUser[];
}

export default function CreateGroupExamForm({
  onSuccess,
  isFetchingSubsets,
  subsets,
}: Props) {
  const [selectedSubsets, setSelectedSubsets] = useState<IUser[]>([]);

  const [isSendingData, setIsSendingData] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    startQuestion: number;
    endQuestion: number;
  }>({
    title: "",
    startQuestion: 1,
    endQuestion: 10,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSendingData(true);
    const res = await fetch("/api/exams/group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        subsets: selectedSubsets.map((s) => s._id),
      }),
    });

    setIsSendingData(false);
    if (res.ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid space-y-4 text-slate-800 dark:text-white">
      <div className="field">
        <label htmlFor="title">عنوان آزمون</label>
        <input
          className="input"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="field">
        <label>زیرمجموعه‌های مجاز</label>
        {isFetchingSubsets ? (
          <Spinner />
        ) : (
          <MultiSelect<IUser>
            options={subsets}
            value={selectedSubsets}
            onChange={setSelectedSubsets}
            optionLabel="name"
            display="chip"
            filter
            placeholder="زیرمجموعه‌ها را انتخاب کنید..."
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label>شماره سوال شروع</label>
          <input
            className="input"
            type="number"
            value={formData.startQuestion}
            onChange={(e) =>
              setFormData({ ...formData, startQuestion: +e.target.value })
            }
            required
          />
        </div>

        <div className="field">
          <label>شماره سوال پایان</label>
          <input
            className="input"
            type="number"
            value={formData.endQuestion}
            onChange={(e) =>
              setFormData({ ...formData, endQuestion: +e.target.value })
            }
            required
          />
        </div>
      </div>

      {isSendingData ? (
        <Button className="mt-4 opacity-70 cursor-not-allowed" disabled>
          <Spinner />
        </Button>
      ) : (
        <Button type="submit" label="ایجاد آزمون" className="mt-4" />
      )}
    </form>
  );
}
