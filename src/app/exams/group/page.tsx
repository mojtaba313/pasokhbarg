"use client";

import GroupExamCard from "@/components/layout/GroupExamCard";
import { Loader } from "@/components/Loader";
import { IntermediateExam } from "@/models/Exam";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import React, { useCallback, useEffect, useRef, useState } from "react";

const GroupExams = () => {
  const session = useSession();

  const [groupExams, setGroupExams] = useState<IntermediateExam[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const showError = useCallback((message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "خطا",
      detail: message,
      life: 3000,
    });
  }, []);

  const handleJoinExam = useCallback(
    async (examId: string) => {
      try {
        const res = await axios.post(`/api/exams/group/${examId}/participant`);
        if (res.status === 200) {
          router.push(`/exams/group/${examId}`);
        }
      } catch (err) {
        console.error("Failed to join exam:", err);
        showError("خطا در پیوستن به آزمون گروهی");
      }
    },
    [router]
  );

  const fetchGroupExams = useCallback(async () => {
    try {
      setIsFetchingData(true);
      const res = await axios.get("/api/exams/group/participant");
      if (res.status === 200) {
        setGroupExams(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch group exams:", err);
      showError("خطا در دریافت آزمون‌های گروهی");
    }
    setIsFetchingData(false);
  }, []);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session.status === "authenticated") {
      Promise.all([fetchGroupExams()]).catch(console.error);
    }
  }, [session.status, router, fetchGroupExams]);

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-8 md:mb-12 mx-5 glass-panel p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          آزمون های دسته جمعی
        </h1>
        <Button icon={<ArrowPathIcon width={30} onClick={fetchGroupExams} />} />
      </div>
      {isFetchingData ? (
        <Loader />
      ) : groupExams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          هیچ آزمون گروهی یافت نشد
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {groupExams.map((exam) => (
            <GroupExamCard key={exam._id} exam={exam} onJoin={handleJoinExam} />
          ))}
        </div>
      )}
    </section>
  );
};

export default GroupExams;
