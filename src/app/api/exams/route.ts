import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "احراز هویت نامعتبر" },
        { status: 401 }
      );
    }

    await connectDB();
    const { title, startQuestion, endQuestion } = await req.json();

    if (!title || startQuestion < 1 || endQuestion <= startQuestion) {
      return NextResponse.json(
        { message: "داده‌های ورودی نامعتبر" },
        { status: 400 }
      );
    }

    const questions = Array.from(
      { length: endQuestion - startQuestion + 1 },
      (_, i) => ({
        number: startQuestion + i,
        selectedOption: 0,
        timeSpent: 0,
        answer: 0,
      })
    );

    const exam = await Exam.create({
      title,
      startQuestion,
      endQuestion,
      questions,
      userId: session.user._id,
      viewed: false,
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { message: "خطا در ایجاد آزمون" },
      { status: 500 }
    );
  }
}

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "احراز هویت نامعتبر" },
        { status: 401 }
      );
    }

    await connectDB();
    const result = await Exam.find({ userId: session.user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching exams:", err);
    return NextResponse.json(
      { message: "خطا در دریافت آزمون‌ها" },
      { status: 500 }
    );
  }
};
