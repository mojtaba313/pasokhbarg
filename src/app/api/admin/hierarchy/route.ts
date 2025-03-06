import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.roles?.includes("master") &&
    !session?.user?.roles?.includes("admin")
  ) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { action, adminId, userId, permissions, userIds } = await req.json();

  console.log('adminId',adminId)
  
  try {
    const admin = await User.findById(adminId);
    if (!admin) {
      return NextResponse.json({ error: "ادمین یافت نشد" }, { status: 404 });
    }

    switch (action) {
      case "add-assistant": {
        // if (admin.roles[0] !== "admin") {
        //   return NextResponse.json(
        //     { error: "فقط ادمین ها می توانند دستیار اضافه کنند" },
        //     { status: 400 }
        //   );
        // }

        // const invalidPerms = permissions.filter(
        //   (p: string) => !admin.permissions.includes(p)
        // );

        // if (invalidPerms.length > 0) {
        //   return NextResponse.json(
        //     {
        //       error: `دسترسی های غیرمجاز: ${invalidPerms.join(", ")}`,
        //     },
        //     { status: 400 }
        //   );
        // }

        // const user = await User.findById(userId);
        // if (!user) {
        //   return NextResponse.json(
        //     { error: "کاربر یافت نشد" },
        //     { status: 404 }
        //   );
        // }

        // user.roles = ["assistant"];
        // if (!user.managedBy.includes(adminId)) {
        //   user.managedBy.push(adminId);
        // }
        // user.maxPermissions = permissions;
        // admin.managedUsers.push(userId);

        // await user.save();
        // await admin.save();
        // break;
      }

      case "add-sub-users": {
        if (!userIds || !Array.isArray(userIds)) {
          return NextResponse.json(
            { error: "لیست کاربران نامعتبر است" },
            { status: 400 }
          );
        }

        const users = await User.find({ _id: { $in: userIds } });
        if (users.length !== userIds.length) {
          return NextResponse.json(
            { error: "برخی از کاربران یافت نشدند" },
            { status: 404 }
          );
        }

        for (const user of users) {
          if (!user.managedBy.includes(adminId)) {
            user.managedBy.push(adminId);
            await user.save();
          }
        }

        admin.managedUsers.push(...userIds);
        await admin.save();
        break;
      }

      case "remove-from-subset": {
        const admin = await User.findById(adminId);
        const user = await User.findById(userId);

        if (!admin || !user) {
          return NextResponse.json(
            { error: "کاربر یا ادمین یافت نشد" },
            { status: 404 }
          );
        }

        user.managedBy = user.managedBy.filter(
          (id: mongoose.Types.ObjectId) => id.toString() !== adminId
        );
        await user.save();

        admin.managedUsers = admin.managedUsers.filter(
          (id: mongoose.Types.ObjectId) => id.toString() !== userId
        );
        await admin.save();

        return NextResponse.json({
          message: "کاربر با موفقیت از زیرمجموعه حذف شد",
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
}
