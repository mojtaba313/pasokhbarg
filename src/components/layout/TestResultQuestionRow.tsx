"use client";

import { IQuestion } from "@/models/Test";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  question: IQuestion;
}

const TestResultQuestionRow = ({ question }: Props) => {
  const { answer, selectedOption, number } = question;

  const renderOptionButton = (i: number) => {
    const isSelected = selectedOption === i + 1;
    const isCorrect = answer === i + 1;
    const bgColor = answer?
      isSelected
      ? isCorrect
        ? "bg-green-500 text-white"
        : "bg-red-500"
      : isCorrect
      ? "border-2 border-green-500"
      : "bg-blue-400/10"
      : isSelected
      ? "bg-blue-500"
      :"bg-blue-400/10"
    return (
      <button
        key={`${number}--${i}`}
        className={`w-9 h-7 p-0 rounded-full cursor-pointer ${bgColor}`}
      >
        {i + 1}
      </button>
    );
  };

  const renderIcon = () => {
    if (!answer) return null;
    if (!selectedOption)
      return <div className="w-4 h-4 rounded-full border-2 border-slate-500" />;
    if (selectedOption === answer)
      return <CheckIcon className="text-green-500" width={20} />;
    return <XMarkIcon className="text-red-500" width={20} />;
  };

  return (
    <div className="flex items-center rounded-md">
      <button className="hover:bg-blue-500/20 flex justify-center items-center min-w-10 px-2 transition-colors rounded place-self-stretch">
        {number}
      </button>
      <div className="flex gap-1 p-2 pl-0">
        {Array(4)
          .fill(0)
          .map((_, i) => renderOptionButton(i))}
      </div>
      <div>{renderIcon()}</div>
    </div>
  );
};

export default TestResultQuestionRow;
