// app/api/exams/group/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import Exam, { IQuestion } from "@/models/Exam";
import connectDB from "@/lib/mongodb";
import GroupExam, { IGroupExam } from "@/models/GroupExam";
import ExportModal from "@/components/ExportModal";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.roles?.includes("admin")) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { title, startQuestion, endQuestion, subsets } = await req.json();

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

    const exam = await GroupExam.create({
      title,
      startQuestion,
      endQuestion,
      allowedSubsets: subsets,
      participants,
      adminId: session.user?._id,
      questions,
    });

    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}



export async function GET() {
  const session = await getServerSession(authOptions);

  const isMaster = session?.user?.roles?.includes("master");
  const isAdmin = session?.user?.roles?.includes("admin");
  if (!isMaster && !isAdmin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const exams: any = isMaster
      ? await GroupExam.find({})
      : await GroupExam.find({ adminId: session?.user?._id });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("خطا در دریافت کاربران:", error);
    return NextResponse.json(
      { error: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }
}
