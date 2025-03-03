import React, { useState } from "react";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";

let i = 0;
const keys = [
  { id: i++, title: "1", key: "1" },
  { id: i++, title: "2", key: "2" },
  { id: i++, title: "3", key: "3" },
  { id: i++, title: "4", key: "4" },
  {
    id: i++,
    title: "0",
    key: "0",
    icon: <div className="w-6 h-6 rounded-full border-2 border-slate-950" />,
  },
  {
    id: i++,
    title: "back",
    key: "Backspace",
    icon: <XMarkIcon className="h-6 w-6" />,
  },
  {
    id: i++,
    title: "",
    key: "ArrowUp",
    icon: <ChevronUpIcon className="h-6 w-6" />,
  },
  {
    id: i++,
    title: "",
    key: "ArrowDown",
    icon: <ChevronDownIcon className="h-6 w-6" />,
  },
  {
    id: i++,
    title: "",
    key: "ArrowLeft",
    icon: <ChevronLeftIcon className="h-6 w-6" />,
  },
  {
    id: i++,
    title: "",
    key: "ArrowRight",
    icon: <ChevronRightIcon className="h-6 w-6" />,
  },
];

const KeyBoard = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleKeyClick = (key: string) => {
    const event = new KeyboardEvent("keydown", { key });
    window.dispatchEvent(event);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
      >
        <WindowIcon width={30} />
      </button>
    );
  }

  return (
    <>
      <div className="glass group flex justify-center items-center backdrop-blur w-full fixed bottom-0 transition duration-300 ease-in-out">
        <div className="grid grid-cols-5 items-center justify-center gap-2 p-4 max-w-[30rem]">
          {keys.map((key) => (
            <button
              key={key.id}
              onClick={() => handleKeyClick(key.key)}
              className="bg-white/50 min-w-20 text-black p-2 rounded-md shadow-md hover:bg-blue-600/50 hover:text-white flex items-center justify-center transition duration-300 ease-in-out"
            >
              {key.icon || key.title}
            </button>
          ))}
        </div>
        <button
          onClick={toggleVisibility}
          className="absolute invisible group-hover:visible bottom-0 left-10 bg-red-500/10 text-white p-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
        >
          <XMarkIcon width={30} />
        </button>
      </div>
    </>
  );
};

export default KeyBoard;
