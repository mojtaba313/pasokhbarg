"use server";
import SingleTestPage from "@/components/templates/SingleTestPage";
import React from "react";

const TestPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <SingleTestPage testID={id} />;
};

export default TestPage;
