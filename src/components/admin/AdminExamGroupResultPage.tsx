"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IExam } from "@/models/Exam";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IParticipant } from "@/models/GroupExam";

export default function AdminExamGroupResultPage({
  examId,
}: {
  examId: string;
}) {
  const { data: session } = useSession();
  const [exam, setExam] = useState<IExam>();
  const [participants, setParticipants] = useState<IParticipant[]>([]);

  const router = useRouter();

  const fetchData = async () => {
    const { data } = await axios.get(`/api/exams/group/${examId}/result`);
    setExam(data);
    setParticipants(data.participants);
  };
  console.log("participants", participants);

  useEffect(() => {
    fetchData();
  }, []);

  const isAdmin = session?.user?.roles?.includes("admin");

  return (
    <div className="p-6">
      <button className="p-5 bg-blue-500 absolute top-0 left-0" onClick={fetchData}>Click</button>
      <h1 className="text-2xl mb-4">نتایج آزمون: {exam?.title}</h1>

      <DataTable value={participants}>
        <Column field="userId.name" header="دانش آموز" />
        <Column field="percent" header="درصد" body={(rowData) => rowData.percent.toFixed(2)} />
        {/* <Column field="startTime" header="زمان شروع" />
        <Column field="endTime" header="زمان پایان" /> */}
        {isAdmin && (
          <Column
            body={(rowData) => (
              <Button
                label="پاسخ‌ها"
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
