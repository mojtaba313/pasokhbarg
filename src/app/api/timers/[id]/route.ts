import { NextRequest, NextResponse } from "next/server";
import Timer from "@/models/Timer";
import connectDB from "@/lib/mongodb";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const id = (await params).id;

  const timer = await Timer.findById(id);
  if (!timer)
    return NextResponse.json({ message: "Timer not found" }, { status: 404 });

  const lastSession = timer.sessions[timer.sessions.length -1];
  if(!lastSession.endTime){
    lastSession.endTime = new Date();
  }else{
    timer.sessions.push({ startTime: Date.now() });
  }
  await timer.save();

  return NextResponse.json(timer, { status: 200 });
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const id = (await params).id;

  const result = await Timer.findByIdAndDelete(id);

  return NextResponse.json(result, { status: 200 });
}
