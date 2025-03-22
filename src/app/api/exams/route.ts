import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user?._id);

    if (!user) {
      return NextResponse.json(
        { message: "احراز هویت نامعتبر" },
        { status: 401 }
      );
    }

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
      userId: user._id,
      viewed: false,
    });

    const newTags = title.replace(/\s+/g, " ").trim().split(" ");

    newTags.forEach((newTag: string) => {
      const tagIndex = user.tags.indexOf(newTag);
      if (tagIndex !== -1) user.tags.splice(tagIndex, 1);
      user.examTags.push(newTag);
    });

    await user.save();

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
    await connectDB();
    
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user?._id);

    if (!user) {
      return NextResponse.json(
        { message: "احراز هویت نامعتبر" },
        { status: 401 }
      );
    }

    const result = await Exam.find({ userId: session.user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ exams: result, user });
  } catch (err) {
    console.error("Error fetching exams:", err);
    return NextResponse.json(
      { message: "خطا در دریافت آزمون‌ها" },
      { status: 500 }
    );
  }
};
