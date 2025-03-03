"use server";
import AddAnwersPage from "@/components/templates/AddAnwersPage";
import ResultPage from "@/components/templates/ResultPage";
import React from "react";

const TestResultPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <ResultPage testID={id} />;
};

export default TestResultPage;
