"use server";
import ResultPage from "@/components/templates/ResultPage";
import React from "react";

const ExamResultPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <ResultPage examID={id} />;
};

export default ExamResultPage;
