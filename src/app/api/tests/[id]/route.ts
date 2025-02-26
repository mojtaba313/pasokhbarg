import connectDB from "@/lib/mongodb";
import Test from "@/models/Test";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const id = (await params).id;
    if (!id) throw new Error();
    await connectDB();
    const result = await Test.find();
    return NextResponse.json(result);
  } catch (err) {
    console.log("error--->", err);
    return NextResponse.json({ message: "has an error ==>", err });
  }
};