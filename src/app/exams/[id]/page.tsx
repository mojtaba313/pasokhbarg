"use server";
import SingleExamPage from "@/components/templates/SingleExamPage";
import React from "react";

const ExamPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <SingleExamPage examID={id} />;
};

export default ExamPage;
