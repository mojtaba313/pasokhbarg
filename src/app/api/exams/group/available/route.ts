// {allowedSubsets:{$in:[ObjectId("67c957a752ef970d045e5539")]}}

import { authOptions } from "@/app/auth/authOptions";
import connectDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id)
      return NextResponse.json(
        { message: "احراز هویت نامعتبر" },
        { status: 401 }
      );

    await connectDB();
    const result = await Exam.find({
      type: "group",
      allowedSubsets: { $in: [session.user._id] },
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
