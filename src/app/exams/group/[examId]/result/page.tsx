"use server";
import GroupExamResultPage from "@/components/templates/GroupExamResultPage";
import React from "react";

const GroupExamResult = async ({ params }: { params: Promise<{ examId: string }> }) => {
  const id = (await params).examId;
  return <GroupExamResultPage examID={id} />;
};

export default GroupExamResult;
