import SingleGroupExamPage from "@/components/templates/SingleGroupExamPage";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const examId = (await params).examId;
  return <SingleGroupExamPage examId={examId} />;
}
