import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.roles?.includes("master") &&
    !session?.user?.roles?.includes("admin")
  ) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { userId, action, targetUserId } = await req.json();

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    switch (action) {
      case "add-student":
        if (!user.roles.includes("admin")) {
          return NextResponse.json(
            { error: "فقط ادمین‌ها می‌توانند دانش‌آموز اضافه کنند" },
            { status: 400 }
          );
        }
        user.students.push(targetUserId);
        targetUser.supervisors.push(userId);
        break;

      case "add-assistant":
        if (!user.roles.includes("admin")) {
          return NextResponse.json(
            { error: "فقط ادمین‌ها می‌توانند دستیار اضافه کنند" },
            { status: 400 }
          );
        }
        targetUser.roles.push("assistant");
        targetUser.assistantOf = userId;
        user.students.push(targetUserId);
        break;

      case "update-permissions":
        if (user.roles.includes("assistant")) {
          const admin = await User.findById(user.assistantOf);
          if (
            !admin?.permissions.every((p: string) =>
              admin.permissions.includes(p)
            )
          ) {
            return NextResponse.json(
              { error: "دستیار نمی‌تواند دسترسی بیشتری از ادمین داشته باشد" },
              { status: 400 }
            );
          }
        }
        targetUser.permissions = (await req.json()).permissions;
        break;

      default:
        return NextResponse.json({ error: "عملیات نامعتبر" }, { status: 400 });
    }

    await user.save();
    await targetUser.save();

    return NextResponse.json({ message: "عملیات موفقیت‌آمیز" });
  } catch (error) {
    console.error("خطا در مدیریت سلسله مراتب:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
