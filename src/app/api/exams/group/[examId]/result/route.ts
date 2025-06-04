import { authOptions } from "@/app/auth/authOptions";
import connectDB from "@/lib/mongodb";
import GroupExam, { IGroupExam } from "@/models/GroupExam";
import User from "@/models/User";
import { claculatePercent, countAnswers } from "@/utils/funcs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,

  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const examId = (await params).examId;
    if (!examId) throw new Error();

    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.roles?.includes("admin")) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const exam: IGroupExam | null = await GroupExam.findById(examId).populate({
      path: "participants.userId",
      select: "name",
    });
    if (!exam) throw new Error();

    exam.participants = exam.participants.map((p) => {
      p.answers = p.answers.map((a) => {
        const question = exam.questions.find((q) => q.number === a.number);
        return { ...a, answer: question?.answer || 0 };
      });

      const { correct, incorrect, unanswered } = countAnswers(p.answers);
      const percent = claculatePercent(correct, incorrect, unanswered);

      return { ...p, percent };
    });

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error("server Erro => ", error);
    return NextResponse.json({ error: "خطا در حذف آزمون" }, { status: 500 });
  }
}
