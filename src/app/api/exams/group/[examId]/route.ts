import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import connectDB from "@/lib/mongodb";
import GroupExam, { IGroupExam } from "@/models/GroupExam";

export async function DELETE(
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

    const deletedExam = await GroupExam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return NextResponse.json({ error: "آزمون پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در حذف آزمون" }, { status: 500 });
  }
}

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

    const exam = await GroupExam.findById(examId);

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در حذف آزمون" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,

  { params }: { params: Promise<{ examId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const examId = (await params).examId;

  const { action, questions } = await req.json();

  const exam: IGroupExam | null = await GroupExam.findById(examId);
  if (!exam)
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });

  switch (action) {
    case "toggle-active": {
      if (!exam.startTime) {
        exam.startTime = new Date();
        await exam.save();
      } else if (!exam.endTime) {
        exam.endTime = new Date();


        await exam.save();
      }
      break;
    }

    case "add-answers": {
      exam.questions = questions;
      await exam.save();
      // return NextResponse.json(
      //   { success: true, message: "Answer added" },
      //   { status: 201 }
      // );
      break;
    }

    default:
      break;
  }

  return NextResponse.json(exam, { status: 201 });
}
