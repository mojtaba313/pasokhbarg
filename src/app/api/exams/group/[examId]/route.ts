// app/api/exams/group/[examId]/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import Exam from "@/models/Exam";
import connectDB from "@/lib/mongodb";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await connectDB();
    const examId = (await params).examId;
    const session = await getServerSession(authOptions);
    const questions = await req.json();

    const exam = await Exam.findById(examId);
    const participant = exam.participants.find((p: any) => {
      return p.userId.toString() === session?.user?._id;
    });

    if (!participant) throw new Error();

    console.log('questions',questions)

    participant.answers = questions;

    console.log('2')
    await exam.save();
    console.log('1')
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, status: 500 });
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

    const exam = await Exam.findById(examId);

    if (!exam.allowedSubsets.includes(session?.user?._id)) new Error();

    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json({ success: false, status: 500 });
  }
}
