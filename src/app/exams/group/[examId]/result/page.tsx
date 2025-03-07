// app/user/exams/[examId]/result/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamResultPage() {
  const { examId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`/api/exams/group/${examId}/result`)
      .then(res => res.json())
      .then(data => setResult(data));
  }, [examId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">نتایج آزمون</h1>
      {result && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded">
              <h3>پاسخ‌های صحیح</h3>
              {/* <p className="text-2xl">{result.correct}</p> */}
            </div>
            <div className="bg-red-100 p-4 rounded">
              <h3>پاسخ‌های غلط</h3>
              {/* <p className="text-2xl">{result.wrong}</p> */}
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <h3>نمره نهایی</h3>
              {/* <p className="text-2xl">{result.score}</p> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}