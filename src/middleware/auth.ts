import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";
import User from "@/models/User";

const hierarchy = {
  'master': 4,
  'admin': 3,
  'assistant': 2,
  'user': 1
};

export async function middleware(req: NextApiRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = new URL(req.url!);

  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // دسترسی مستر
  if (url.pathname.startsWith('/admin/master') && 
      !session?.user?.roles?.includes('master')) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // دسترسی ادمین
  if (url.pathname.startsWith('/admin') && 
      !session?.user?.roles?.some(r => ['master', 'admin'].includes(r))) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // بررسی سلسله مراتب برای ادمین‌ها
  if (session?.user?.roles?.includes('admin')) {
    const requestedUserId = url.searchParams.get('userId');
    if (requestedUserId) {
      const requestedUser = await User.findById(requestedUserId)
        .select('supervisors students')
        .populate('supervisors students');
      
      // بررسی آیا کاربر درخواستی زیرمجموعه ادمین فعلی است
      const isAuthorized = requestedUser?.supervisors.some((sup: any) => 
        sup._id.toString() === session?.user?._id.toString()
      );
      
      if (!isAuthorized) {
        return NextResponse.redirect(new URL('/403', req.url));
      }
    }
  }

  return NextResponse.next();
}