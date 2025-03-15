import connectDB from "@/lib/mongodb";
import Exam, { IExam } from "@/models/Exam";
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
    const result = await Exam.findById(id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ message: "has an error ==>", err });
  }
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;

  try {
    await connectDB();
    const exam = await Exam.findById(id);

    if (!exam.startTime) {
      exam.startTime = new Date();
      await exam.save();
    }

    return new Response(null, { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;

  try {
    await connectDB();
    const exam = await Exam.findById(id);
    let updates = await req.json();

    // const times = updates.questions.map((q: any) => q.timeSpent);

    // if (exam.endTime) {
    //   const questions = updates.questions?.map((q: any) => ({
    //     ...q,
    //     selectedOption: undefined,
    //     timeSpent: undefined,
    //   }));

    //   updates = { ...updates, questions };
    // }

    const options = { new: true, runValidators: true };

    const editedExam = await Exam.findByIdAndUpdate(id, updates, options);

    if (!editedExam) {
      return new Response(JSON.stringify({ message: "Exam not found" }), {
        status: 404,
      });
    }

    return new Response(null, { status: 201 });
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
    await Exam.findByIdAndDelete(id);
    return NextResponse.json({ success: true, status: 203 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete exam" },
      { status: 500 }
    );
  }
}
