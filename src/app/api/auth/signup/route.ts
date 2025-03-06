import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, username, password } = await req.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        { message: "تمامی فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "این نام کاربری قبلاً ثبت‌نام کرده است" },
        { status: 400 }
      );
    }

    const user = await User.create({ 
      name, 
      username: username.toLowerCase(),
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