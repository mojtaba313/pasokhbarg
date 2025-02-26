"use client";

import { IQuestion } from "@/models/Test";
import { foramttMin } from "@/utils/funcs";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  question: IQuestion;
  currentQuestion: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  onPause: (number: number, addingTime: number) => void;
  onChoose: (number: number, optionNumber: number) => void;
}

const QuestionRow = ({
  question,
  currentQuestion,
  setCurrentQuestion,
  onPause,
  onChoose,
}: Props) => {
  const [time, setTime] = useState(question.timeSpent);
  const intervalRef = useRef<number | null>(null);

  const isCurrent: boolean = question.number === currentQuestion;

  const setThisOneAsCurrentQuestion = () =>
    isCurrent ? setCurrentQuestion(0) : setCurrentQuestion(question.number);

  const handleOptionChoose = (index: number) =>
    index + 1 === question.selectedOption
      ? onChoose(question.number, 0)
      : onChoose(question.number, index + 1);

  useEffect(() => {
    if (isCurrent) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCurrent]);

  useEffect(() => {
    if (question.timeSpent !== time) {
      console.log("row", time, question);
      onPause(question.number, time);
    }
  }, [currentQuestion]);

  return (
    <div
      className={`flex items-center rounded-md ${
        isCurrent ? "bg-blue-500/10" : ""
      }`}
    >
      <button
        className="hover:bg-blue-500/20 flex justify-center items-center min-w-10 px-2 transition-colors rounded place-self-stretch"
        onClick={setThisOneAsCurrentQuestion}
      >
        {isCurrent ? "✨" : question.number}
      </button>
      <div className="flex gap-1 p-2 pl-0">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <button
              onClick={() => handleOptionChoose(i)}
              key={`${question.number}--${i}`}
              className={`w-9 h-7 p-0 rounded-full cursor-pointer ${
                question.selectedOption === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-blue-400/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
      </div>
      <div className="px-2">{foramttMin(time)}</div>
      {/* <div className="px-2">{question.timeSpent}:0</div> */}
    </div>
  );
};

export default QuestionRow;
