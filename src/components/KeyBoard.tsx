"use client";
import React, { useEffect, useState } from "react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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

type Props = {
  isVisible: boolean;
};

const KeyBoard = ({ isVisible }: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setPosition({
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight - 100,
    });
  }, []);

  const handleKeyClick = (key: string) => {
    const event = new KeyboardEvent("keydown", { key });
    window.dispatchEvent(event);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;

    setDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      console.log(dragging, e);
      // if (dragging) {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
      // }
    };

    const handleMouseUp = () => {
      if (typeof window === "undefined") return;
      setDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div
        className="glass group flex justify-center items-center backdrop-blur absolute transition duration-300 ease-in-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragging ? "grabbing" : "grab",
          display: isVisible ? "block" : "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <button className="absolute glass bottom-full w-12 h-12 left-0 !rounded-br-none"></button>
        <div className="grid grid-cols-4 items-center justify-center gap-2 p-4 max-w-[30rem]">
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
      </div>
    </>
  );
};

export default KeyBoard;
