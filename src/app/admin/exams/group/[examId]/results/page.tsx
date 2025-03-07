// app/exams/group/[examId]/results/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IExam } from "@/models/Exam";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default async function GroupExamResults({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const examId = (await params).examId;
  const { data: session } = useSession();
  const [exam, setExam] = useState<IExam>();
  const [participants, setParticipants] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/exams/group/${examId}`)
      .then((res) => res.json())
      .then((data) => {
        setExam(data);
        setParticipants(data.participants);
      });
  }, []);

  const isAdmin = session?.user?.roles?.includes("admin");

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">نتایج آزمون: {exam?.title}</h1>

      <DataTable value={participants}>
        <Column field="user.name" header="نام شرکت کننده" />
        <Column field="score" header="نمره" />
        <Column field="startTime" header="زمان شروع" />
        <Column field="endTime" header="زمان پایان" />
        {isAdmin && (
          <Column
            body={(rowData) => (
              <Button
                label="مشاهده پاسخ‌ها"
                onClick={() =>
                  router.push(
                    `/admin/exams/group/${examId}/participants/${rowData.userId}`
                  )
                }
              />
            )}
          />
        )}
      </DataTable>
    </div>
  );
}
