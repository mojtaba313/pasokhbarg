import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";
import User from "@/models/User";

const hierarchy = {
  master: 4,
  admin: 3,
  assistant: 2,
  user: 1,
};

export async function middleware(req: NextRequest) {
  const session = await getToken({ req });
  const path = req.nextUrl.pathname;

  // دسترسی مستر
  if (path.startsWith("/admin/master")) {
    if (!session?.user?.roles?.includes("master")) {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  // دسترسی ادمین معمولی
  if (path.startsWith("/admin")) {
    if (!session?.user?.roles?.some((r) => ["master", "admin"].includes(r))) {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  // بررسی دسترسی های سلسله مراتبی
  if (session?.user?.roles?.includes("admin")) {
    const targetUserId = req.nextUrl.searchParams.get("userId");
    if (targetUserId) {
      const isAuthorized = await checkUserHierarchy(
        session.user._id,
        targetUserId
      );
      if (!isAuthorized) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }
  }
}

async function checkUserHierarchy(adminId: string, targetUserId: string) {
  const user = await User.findById(targetUserId)
    .populate('managedBy');
  
  return user.managedBy?._id.toString() === adminId;
}
