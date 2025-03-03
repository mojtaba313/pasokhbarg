"use server";
import AddAnwersPage from "@/components/templates/AddAnwersPage";
import React from "react";

const TestPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <AddAnwersPage testID={id} />;
};

export default TestPage;
