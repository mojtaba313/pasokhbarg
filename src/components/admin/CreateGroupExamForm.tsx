// components/admin/CreateGroupExamForm.tsx
"use client";
import { FormEvent, useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { IUser } from "@/models/User";
import { Nullable } from "primereact/ts-helpers";

export default function CreateGroupExamForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const [subsets, setSubsets] = useState<IUser[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    startQuestion: number;
    endQuestion: number;
    startTime: Nullable<Date>;
    endTime: Nullable<Date>;
  }>({
    title: "",
    startQuestion: 1,
    endQuestion: 10,
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    fetch(`/api/admin/users?adminId=${session?.user?._id}`)
      .then((res) => res?.json())
      .then((data) => setSubsets(data));
  }, [session]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/exams/group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        subsets: subsets.map((s) => s._id),
      }),
    });

    if (res.ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid space-y-4">
      <div className="field">
        <label htmlFor="title">عنوان آزمون</label>
        <input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="field">
        <label>زیرمجموعه‌های مجاز</label>
        <MultiSelect
          value={subsets}
          options={subsets}
          onChange={(e) => setSubsets(e.value)}
          optionLabel="name"
          display="chip"
          filter
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label>زمان شروع</label>
          <Calendar
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.value })}
            showTime
            required
          />
        </div>

        <div className="field">
          <label>زمان پایان</label>
          <Calendar
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.value })}
            showTime
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label>شماره سوال شروع</label>
          <input
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
            type="number"
            value={formData.endQuestion}
            onChange={(e) =>
              setFormData({ ...formData, endQuestion: +e.target.value })
            }
            required
          />
        </div>
      </div>

      <Button type="submit" label="ایجاد آزمون" className="mt-4" />
    </form>
  );
}
