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
    
    if (!exam) {
      return new Response(JSON.stringify({ message: "Exam not found" }), {
        status: 404,
      });
    }

    const updates = await req.json();


    if (updates.questions) {
      const validatedQuestions = updates.questions.map((q: any) => {
        if (q.analysis) {
          const validAnalysis: Record<string, any> = {};
          
          if (typeof q.analysis.chapter === 'string') {
            validAnalysis.chapter = q.analysis.chapter.trim();
          }
          
          if (typeof q.analysis.topic === 'string') {
            validAnalysis.topic = q.analysis.topic.trim();
          }
          
          if (typeof q.analysis.description === 'string') {
            validAnalysis.description = q.analysis.description.trim();
          }
          
          return {
            ...q,
            analysis: Object.keys(validAnalysis).length > 0 ? validAnalysis : undefined
          };
        }
        return q;
      });

      console.log(id)

      updates.questions = validatedQuestions;
    }

    const updateFields: Record<string, any> = {};
    
    if (updates.questions) {
      updateFields.questions = updates.questions;
    }
    
    if (typeof updates.viewed === 'boolean') {
      updateFields.viewed = updates.viewed;
    }

    const options = { new: true, runValidators: true };
    const editedExam = await Exam.findByIdAndUpdate(id, { $set: updateFields }, options);

    return new Response(JSON.stringify(editedExam), { status: 200 });
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
