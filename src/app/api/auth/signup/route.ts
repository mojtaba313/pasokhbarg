// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// app/api/auth/signup/route.ts
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, username, password } = await req.json();

    // اعتبارسنجی داده‌ها
    if (!username || !password || !name) {
      return NextResponse.json(
        { message: "تمامی فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // بررسی وجود کاربر با همین نام کاربری
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "این نام کاربری قبلاً ثبت‌نام کرده است" },
        { status: 400 }
      );
    }

    // ایجاد کاربر جدید
    const user = await User.create({ 
      name, 
      username: username.toLowerCase(), // تبدیل به حروف کوچک
      password 
    });

    return NextResponse.json({ 
      message: "ثبت‌نام موفقیت‌آمیز بود",
      user: {
        id: user._id,
        name: user.name,
        username: user.username
      }
    });

  } catch (error: any) {
    console.error("Error in signup:", error);
    
    // هندل کردن خطاهای MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "این نام کاربری قبلاً ثبت‌نام کرده است" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "خطا در ثبت‌نام" },
      { status: 500 }
    );
  }
}