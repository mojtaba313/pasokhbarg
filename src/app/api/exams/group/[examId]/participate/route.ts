// app/api/exams/group/[examId]/participants/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import Exam, { IExam, IQuestion } from "@/models/Exam";
import { IUser } from "@/models/User";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const examId = (await params).examId;

  const session = await getServerSession(authOptions);
  if (!session?.user?._id) return;

  const exam = await Exam.findById(examId);
  if (!exam)
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });

  // بررسی دسترسی کاربر
  if (!exam.allowedSubsets.includes(session?.user?._id)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  // شروع آزمون برای کاربر
  exam.participants.push({
    userId: session.user._id,
    answers: new Map(),
    score: 0,
    startTime: new Date(),
  });

  await exam.save();
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) return;
  const { answers } = await req.json();
  const examId = (await params).examId;

  const exam = await Exam.findById(examId);
  if (!exam) return;

  const participant = exam.participants.find(
    (p: any) => p.userId === (session.user as IUser)._id
  );
  if (!participant) return;

  participant.answers = answers;
  participant.endTime = new Date();
  participant.score = calculateScore(answers, exam.questions);

  await exam.save();
  return NextResponse.json({ success: true });
}

function calculateScore(answers: any, questions: IQuestion[]) {
  return questions.reduce((score, q) => {
    if (answers.get(q.number) === q.answer) score += 3;
    else if (answers.get(q.number)) score -= 1;
    return score;
  }, 0);
}
