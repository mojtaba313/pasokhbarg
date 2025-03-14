import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import connectDB from "@/lib/mongodb";
import GroupExam from "@/models/GroupExam";

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
