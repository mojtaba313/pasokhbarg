// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

// اتصال به دیتابیس
await connectDB();

// GET: دریافت لیست کاربران
export async function GET() {
  const session = await getServerSession(authOptions);

  console.log("session", session);

  // بررسی دسترسی ادمین
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    // دریافت تمام کاربران (بدون پسورد)
    const users = await User.find({}).select("-password");
    return NextResponse.json(users);
  } catch (error) {
    console.error("خطا در دریافت کاربران:", error);
    return NextResponse.json(
      { error: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }
}

// POST: ایجاد کاربر جدید
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // بررسی دسترسی ادمین
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { name, username, password, roles } = await req.json();

    // بررسی وجود کاربر با همین نام کاربری
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "این نام کاربری قبلاً ثبت‌نام کرده است" },
        { status: 400 }
      );
    }

    // ایجاد کاربر جدید
    const newUser = await User.create({
      name,
      username,
      password,
      roles: roles || ["user"], // نقش پیش‌فرض 'user'
    });

    // بازگرداندن کاربر بدون پسورد
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("خطا در ایجاد کاربر:", error);
    return NextResponse.json({ error: "خطا در ایجاد کاربر" }, { status: 500 });
  }
}

// PUT: به‌روزرسانی کاربر
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  // بررسی دسترسی ادمین
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { userId, updates } = await req.json();

    // بررسی وجود کاربر
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // به‌روزرسانی کاربر
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("خطا در به‌روزرسانی کاربر:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی کاربر" },
      { status: 500 }
    );
  }
}

// DELETE: حذف کاربر
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  // بررسی دسترسی ادمین
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { userId } = await req.json();

    // بررسی وجود کاربر
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // حذف کاربر
    await User.findByIdAndDelete(userId);
    return NextResponse.json(
      { message: "کاربر با موفقیت حذف شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("خطا در حذف کاربر:", error);
    return NextResponse.json({ error: "خطا در حذف کاربر" }, { status: 500 });
  }
}
