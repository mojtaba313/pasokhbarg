import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

await connectDB();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { name, username, password, roles } = await req.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "این نام کاربری قبلاً ثبت‌نام کرده است" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      username,
      password,
      roles: roles || ["user"],
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("خطا در ایجاد کاربر:", error);
    return NextResponse.json({ error: "خطا در ایجاد کاربر" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

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