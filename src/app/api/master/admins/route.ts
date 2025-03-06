import { authOptions } from "@/app/auth/authOptions";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("master")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const admins = await User.find({ roles: { $in: ["admin"] } }).select(
      "-password"
    );
    const users = await User.find({
      roles: { $nin: ["admin", "master"] },
    }).select("-password");
    return NextResponse.json({ admins, users });
  } catch (error) {
    console.error("خطا در دریافت مدیران:", error);
    return NextResponse.json(
      { error: "خطا در دریافت مدیران" },
      { status: 500 }
    );
  }
}

export const POST = async (req: Request) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("master")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { action, adminId, userIds } = await req.json();

  try {
    switch (action) {
      case "add-admin": {
        console.log("admin-add");
        if (!userIds || !Array.isArray(userIds)) {
          return NextResponse.json(
            { error: "لیست کاربران نامعتبر است" },
            { status: 400 }
          );
        }

        for (const userId of userIds) {
          await User.updateOne({ _id: userId }, { $push: { roles: "admin" } });
        }

        break;
      }

      case "remove-admin": {
        await User.updateOne({ _id: adminId }, { $pull: { roles: "admin" } });

        const usersManagedByAdmin = await User.find({ managedBy: adminId });

        for (const user of usersManagedByAdmin) {
          user.managedBy = user.managedBy.filter(
            (id: mongoose.Types.ObjectId) => id.toString() !== adminId
          );
          await user.save();
        }

        return NextResponse.json({
          message:
            "کاربر با موفقیت از حالت ادمین خارج شد و زیرمجموعه‌هایش نیز به‌روزرسانی شدند",
          success: true,
        });
      }

      default: {
        return NextResponse.json(
          { error: "عملیات نامعتبر است" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "عملیات موفقیت‌آمیز", success: true });
  } catch (error) {
    console.error("خطا در مدیریت سلسله مراتب:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
};
