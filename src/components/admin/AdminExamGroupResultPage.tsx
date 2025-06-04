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
import {
  ArrowLongLeftIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "../Loader";

export default function AdminExamGroupResultPage({
  examId,
}: {
  examId: string;
}) {
  const { data: session } = useSession();
  const [exam, setExam] = useState<IExam>();
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const router = useRouter();

  const fetchData = async () => {
    setIsFetchingData(true);
    const { data } = await axios.get(`/api/exams/group/${examId}/result`);
    setExam(data);
    setParticipants(data.participants);
    setIsFetchingData(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isAdmin = session?.user?.roles?.includes("admin");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 md:mb-12 mx-5 glass-panel p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          نتایج آزمون: {exam?.title}
        </h1>
        <div className="flex gap-3">
          <Button icon={<ArrowPathIcon width={30} onClick={fetchData} />} />
          <Button onClick={router.back}>
            <span className="px-2">بازگشت</span>
            <ArrowLongLeftIcon width={30} />
          </Button>
        </div>
      </div>

      {isFetchingData ? (
        <Loader />
      ) : participants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          هیچ آزمون گروهی یافت نشد
        </div>
      ) : (
        <div className="glass-effect p-4 rounded-lg !overflow-hidden">
          <DataTable value={participants}>
            <Column field="userId.name" header="دانش آموز" />
            <Column
              field="percent"
              header="درصد"
              body={(rowData) => rowData.percent.toFixed(2)}
            />
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
      )}
    </div>
  );
}
