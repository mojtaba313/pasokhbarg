// app/api/tests/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Test from "@/models/Test";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, startQuestion, endQuestion } = await req.json();

    // اعتبارسنجی داده‌ها
    if (!title || startQuestion < 1 || endQuestion <= startQuestion) {
      return NextResponse.json(
        { message: "داده‌های نامعتبر" },
        { status: 400 }
      );
    }

    // ایجاد آرایه سوالات
    const questions = Array.from(
      { length: endQuestion - startQuestion + 1 },
      (_, i) => ({
        number: startQuestion + i,
        timeSpent: 0,
      })
    );

    const test = await Test.create({
      title,
      startQuestion,
      endQuestion,
      questions,
      userId: "user-id", // باید از سیستم احراز هویت استفاده کنید
    });
    return NextResponse.json(test);
  } catch (error) {
    console.log("error -> ", error);
    return NextResponse.json(
      { message: "خطا در ایجاد آزمون" },
      { status: 500 }
    );
  }
}

export const GET = async () => {
  console.log("get get get -------------------------------");
  try {
    await connectDB();
    const result = await Test.find();
    return NextResponse.json(result);
  } catch (err) {
    console.log("error--->", err);
    return NextResponse.json({ message: "has an error ==>", err });
  }
};

