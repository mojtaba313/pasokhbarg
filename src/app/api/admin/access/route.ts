// app/api/admin/access/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth/authOptions';
import PageAccess from '@/models/PageAccess';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
  }

  const pages = await PageAccess.find().populate('allowedUsers');
  return NextResponse.json(pages);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
  }

  const updates = await req.json();
  const updatedPage = await PageAccess.findByIdAndUpdate(params.id, updates, { new: true }).populate('allowedUsers');
  return NextResponse.json(updatedPage);
}