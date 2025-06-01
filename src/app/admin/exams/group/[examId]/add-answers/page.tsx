"use server";
import GroupExamAddAnwersPage from "@/components/templates/GroupExamAddAnwersPage";
import React from "react";

const AdminGroupExamAddAnswerPage = async ({ params }: { params: Promise<{ examId: string }> }) => {
  const id = (await params).examId;
  return <GroupExamAddAnwersPage examID={id} />;
};

export default AdminGroupExamAddAnswerPage;
