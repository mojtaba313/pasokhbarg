// middleware/auth.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";

export async function middleware(req: NextApiRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}
