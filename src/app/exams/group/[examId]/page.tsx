import SingleGroupExamPage from "@/components/templates/SingleGroupExamPage";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const examId = (await params).examId;
  // const { examId } = useParams();
  // const router = useRouter();
  // const [exam, setExam] = useState(null);
  // const [answers, setAnswers] = useState(new Map());

  // const handleSubmit = async () => {
  //   await fetch(`/api/exams/group/${examId}/submit`, {
  //     method: "POST",
  //     body: JSON.stringify({ answers: Object.fromEntries(answers) }),
  //   });
  //   router.push(`/user/exams/${examId}/result`);
  // };

  // if (!exam) return <div>Loading...</div>;

  return <SingleGroupExamPage examId={examId} />;
}
