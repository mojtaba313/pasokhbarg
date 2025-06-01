// app/api/exams/group/[examId]/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import Exam from "@/models/Exam";

// Submitting Exams End By user
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }>}
) {  
  const examId = (await params).id;
  const session = await getServerSession(authOptions);

  const exam = await Exam.findById(examId);
  const participant = exam.participants.find((p:any) => p.userId === session?.user?._id);
  participant.endTime = new Date();

  await exam.save();
  return NextResponse.json({ success: true });
}