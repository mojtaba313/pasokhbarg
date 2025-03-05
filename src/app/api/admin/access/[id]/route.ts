import { authOptions } from "@/app/auth/authOptions";
import PageAccess from "@/models/PageAccess";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes("admin")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const updates = await req.json();
  const updatedPage = await PageAccess.findByIdAndUpdate(id, updates, {
    new: true,
  }).populate("allowedUsers");
  return NextResponse.json(updatedPage);
}
