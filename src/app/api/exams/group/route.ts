// app/api/exams/group/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import Exam, { IQuestion } from "@/models/Exam";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { title, startQuestion, endQuestion, subsets, startTime, endTime } =
    await req.json();

  const questionsRange = [startQuestion, endQuestion].sort((a, b) => a - b);
  const questions = Array(questionsRange[1] - questionsRange[0] + 1)
    .fill(0)
    .map((_, i) => ({ number: questionsRange[0] + i, answer: 0 }));

  const participants = subsets.map((s: string) => ({
    userId: s,
    answers: questions.map((q) => ({
      number: q.number,
      selectedOption: 0,
      timeSpent: 0,
    })),
  }));

  const exam = await Exam.create({
    title,
    type: "group",
    startQuestion,
    endQuestion,
    allowedSubsets: subsets,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    status: "planned",
    participants,
    adminId: session.user?._id,
    questions,
  });

  return NextResponse.json(exam);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { examId, action } = await req.json();

  const exam = await Exam.findById(examId);
  if (!exam)
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });

  if (action === "start") exam.status = "active";
  if (action === "stop") exam.status = "finished";
  await exam.save();

  return NextResponse.json(exam);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  const isMaster = session?.user?.roles?.includes("master");
  const isAdmin = session?.user?.roles?.includes("admin");
  if (!isMaster && !isAdmin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const users: any = isMaster
      ? await Exam.find({ type: "group" })
      : await Exam.find({ type: "group", adminId: session?.user?._id });
    return NextResponse.json(users);
  } catch (error) {
    console.error("خطا در دریافت کاربران:", error);
    return NextResponse.json(
      { error: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }
}
