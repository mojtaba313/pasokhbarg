"use server";
import AddAnwersPage from "@/components/templates/AddAnwersPage";
import React from "react";

const AddAnswerPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <AddAnwersPage examID={id} />;
};

export default AddAnswerPage;
