import { authOptions } from "@/app/auth/authOptions";
import connectDB from "@/lib/mongodb";
import Timer from "@/models/Timer";
import { getServerSession } from "next-auth";

export const GET = async (req: Request) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const timers = await Timer.find({ userId: session?.user?._id });
  return Response.json(timers, { status: 200 });
};

export const POST = async (req: Request) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { title } = await req.json();
  const newTimer = new Timer({
    title,
    userId: session?.user?._id,
    sessions: [{ startTime: Date.now() }],
  });
  await newTimer.save();

  return Response.json(newTimer, { status: 201 });
};

export const PUT = async (req: Request) => {
  await connectDB();
  const { id } = await req.json();
  const timer = await Timer.findById(id);

  if (!timer)
    return Response.json({ message: "Timer not found" }, { status: 404 });

  timer.sessions.push({ startTime: Date.now() });
  await timer.save();

  return Response.json(timer, { status: 200 });
};

export const DELETE = async (req: Request) => {
  await connectDB();
  const { id } = await req.json();
  await Timer.findByIdAndDelete(id);

  return Response.json({ message: "Timer deleted" }, { status: 200 });
};
