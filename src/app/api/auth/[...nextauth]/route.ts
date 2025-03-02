// // app/api/tests/route.ts
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Test from "@/models/Test";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/auth/authOptions"; // import صحیح

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions); // استفاده از authOptions
//     if (!session?.user) {
//       return NextResponse.json(
//         { message: "احراز هویت نامعتبر" },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const { title, startQuestion, endQuestion } = await req.json();

//     // اعتبارسنجی داده‌ها
//     if (!title || startQuestion < 1 || endQuestion <= startQuestion) {
//       return NextResponse.json(
//         { message: "داده‌های ورودی نامعتبر" },
//         { status: 400 }
//       );
//     }

//     // ایجاد آرایه سوالات
//     const questions = Array.from(
//       { length: endQuestion - startQuestion + 1 },
//       (_, i) => ({
//         number: startQuestion + i,
//         selectedOption: 0,
//         timeSpent: 0,
//       })
//     );

//     const test = await Test.create({
//       title,
//       startQuestion,
//       endQuestion,
//       questions,
//       userId: session.user._id,
//       viewed: false,
//     });

//     return NextResponse.json(test);
//   } catch (error) {
//     console.error("Error creating test:", error);
//     return NextResponse.json(
//       { message: "خطا در ایجاد آزمون" },
//       { status: 500 }
//     );
//   }
// }

// export const GET = async () => {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json(
//         { message: "احراز هویت نامعتبر" },
//         { status: 401 }
//       );
//     }

//     const userId = session.user._id; 

//     await connectDB();
//     const result = await Test.find({ userId: session.user._id }).sort({
//       createdAt: -1,
//     });
    
//     return NextResponse.json(result);
//   } catch (err) {
//     console.error("Error fetching tests:", err);
//     return NextResponse.json(
//       { message: "خطا در دریافت آزمون‌ها" },
//       { status: 500 }
//     );
//   }
// };

// export const PUT = async (req: Request) => {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json(
//         { message: "احراز هویت نامعتبر" },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const { testId, updates } = await req.json();

//     const existingTest = await Test.findOne({
//       _id: testId,
//       userId: session.user._id,
//     });
    
//     if (!existingTest) {
//       return NextResponse.json(
//         { message: "آزمون یافت نشد" },
//         { status: 404 }
//       );
//     }

//     const updatedTest = await Test.findByIdAndUpdate(
//       testId,
//       updates,
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json(updatedTest);
//   } catch (error) {
//     console.error("Error updating test:", error);
//     return NextResponse.json(
//       { message: "خطا در به‌روزرسانی آزمون" },
//       { status: 500 }
//     );
//   }
// };

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };