// app/api/test-connection/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "Connected successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "Connection failed", error: error.message },
      { status: 500 }
    );
  }
}
