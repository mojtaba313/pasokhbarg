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
    const result = await Test.findById(id);
    return NextResponse.json(result);
  } catch (err) {
    console.log("error--->", err);
    return NextResponse.json({ message: "has an error ==>", err });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;

  try {
    await connectDB();
    const updates = await req.json();
    const options = { new: true, runValidators: true };

    const user = await Test.findByIdAndUpdate(id, updates, options);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await connectDB();
    await Test.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}
