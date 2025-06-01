// app/api/exams/group/[examId]/participants/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import { IUser } from "@/models/User";
import GroupExam, { IGroupExam, IParticipant } from "@/models/GroupExam";
import connectDB from "@/lib/mongodb";
import { claculatePercent, countAnswers } from "@/utils/funcs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const examId = (await params).examId;

  const session = await getServerSession(authOptions);
  if (!session?.user?._id) throw new Error();

  const exam: IGroupExam | null = await GroupExam.findById(examId);
  if (!exam)
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });

  if (!exam.allowedSubsets.includes(session?.user?._id)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const participant: any = exam.participants.find((p) => {
    return p.userId.toString() === session?.user?._id;
  });

  if (participant) {
    participant.startTime = participant.startTime || new Date();
  } else {
    const answers = exam.questions.map((q) => ({
      number: q.number,
      answer: 0,
      selectedOption: 0,
      timeSpent: 0,
    }));
    exam.participants.push({
      userId: session.user._id,
      startTime: new Date(),
      answers,
    });
  }

  await exam.save();
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) return;

    const answers = await req.json();
    const examId = (await params).examId;

    const exam = await GroupExam.findById(examId);
    if (!exam) throw new Error();

    const participant = exam.participants.find(
      (p: any) => p.userId.toString() === (session.user as IUser)._id
    );

    if (!participant || exam.questions.length !== answers.length)
      throw new Error("here");

    participant.answers = answers;
    participant.endTime = new Date();

    await exam.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("has an error !!!", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await connectDB();
    const examId = (await params).examId;
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) throw new Error();

    // participants
    const exam: IGroupExam = await GroupExam.findById(examId).select(
      "title startTime endTime participants allowedSubsets questions"
    );
    const participant: IParticipant | null | undefined =
      exam?.participants?.find(
        (p: any) => p.userId.toString() === session?.user?._id
      );

    if (
      !exam.allowedSubsets.includes(session?.user?._id) ||
      !exam ||
      !participant
    )
      throw new Error();

    participant.answers = participant.answers.map((a) => {
      const question = exam.questions.find((q) => q.number === a.number);
      return { ...a, answer: question?.answer || 0 };
    });

    const { correct, incorrect, unanswered } = countAnswers(
      participant.answers
    );
    const percent = claculatePercent(correct, incorrect, unanswered);
    participant.percent = percent;

    if (!exam.allowedSubsets.includes(session?.user?._id)) throw new Error();

    return NextResponse.json({ exam, participant });
  } catch (error) {
    console.error("server Error => ", error);
    return NextResponse.json({ status: 500 });
  }
}
