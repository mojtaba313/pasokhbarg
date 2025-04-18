// components/QuestionAnalysisModal.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { IQuestion, IQuestionAnalysis } from "@/models/Exam";
import { Loader } from "./Loader";

interface QuestionAnalysisModalProps {
  question: IQuestion;
  visible: boolean;
  onHide: () => void;
  onSave: (analysis: IQuestionAnalysis) => void;
  chapters: string[];
  topics: string[];
  isLoading: boolean;
}

export default function QuestionAnalysisModal({
  question,
  visible,
  onHide,
  onSave,
  chapters,
  topics,
  isLoading,
}: QuestionAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<IQuestionAnalysis>(
    question.analysis || {}
  );
  const [filteredChapters, setFilteredChapters] = useState<string[]>(chapters);
  const [filteredTopics, setFilteredTopics] = useState<string[]>(topics);
  const firstInput = useRef<any>();
  
  useEffect(() => {
    if (question.analysis) {
      setAnalysis(question.analysis);
    } else {
      setAnalysis({});
    }
  }, [question]);

useEffect(() => {
  if (visible) {
    setTimeout(() => {
      firstInput.current?.focus();
    }, 100);
  }
}, [visible]);

  const searchChapters = (event: { query: string }) => {
    setFilteredChapters(
      chapters.filter((chapter) =>
        chapter.toLowerCase().includes(event.query.toLowerCase())
      )
    );
  };

  const searchTopics = (event: { query: string }) => {
    setFilteredTopics(
      topics.filter((topic) =>
        topic.toLowerCase().includes(event.query.toLowerCase())
      )
    );
  };

  return (
    <Dialog
      header={`تحلیل سوال ${question.number}`}
      visible={visible}
      style={{ width: "90vw", maxWidth: "500px" }}
      onHide={onHide}
      className="glass-panel *:!text-gray-200 overflow-hidden"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">فصل</label>
            <AutoComplete
              value={analysis.chapter || ""}
              suggestions={filteredChapters}
              completeMethod={searchChapters}
              onChange={(e) => setAnalysis({ ...analysis, chapter: e.value })}
              placeholder="فصل مربوطه را انتخاب کنید"
              className="w-full"
              inputRef={firstInput}
            />
          </div>

          <div>
            <label className="block mb-2">مبحث</label>
            <AutoComplete
              value={analysis.topic || ""}
              suggestions={filteredTopics}
              completeMethod={searchTopics}
              onChange={(e) => setAnalysis({ ...analysis, topic: e.value })}
              placeholder="مبحث مربوطه را انتخاب کنید"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">توضیحات</label>
            <textarea
              value={analysis.description || ""}
              onChange={(e) =>
                setAnalysis({ ...analysis, description: e.target.value })
              }
              placeholder="توضیحات اضافه..."
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              label="ذخیره"
              className="!bg-blue-600 !border-0"
              onClick={() => {
                onSave(analysis);
              }}
            />
            <Button
              label="انصراف"
              className="!bg-gray-600 !border-0"
              onClick={onHide}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
