import React, { FC, useRef, useEffect, useState, ReactElement } from "react";
import dynamic from "next/dynamic";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Draggable = dynamic(() => import("react-draggable"), { ssr: false });

interface Key {
  id: number;
  title: string;
  key: string;
  icon?: ReactElement;
}

let i = 0;
const keys: Key[] = [
  { id: i++, title: "4", key: "4" },
  { id: i++, title: "3", key: "3" },
  { id: i++, title: "2", key: "2" },
  { id: i++, title: "1", key: "1" },
  {
    id: i++,
    title: "0",
    key: "0",
    icon: (
      <div className="w-6 h-6 rounded-full border-2 border-slate-950 hover:border-white" />
    ),
  },
  {
    id: i++,
    title: "",
    key: "ArrowRight",
    icon: <ChevronRightIcon className="h-6 w-6" />,
  },
  {
    id: i++,
    title: "",
    key: "ArrowLeft",
    icon: <ChevronLeftIcon className="h-6 w-6" />,
  },
  {
    id: i++,
    title: "back",
    key: "Backspace",
    icon: <XMarkIcon className="h-6 w-6" />,
  },
];

interface Props {
  isVisible: boolean;
}

const KeyBoard: FC<Props> = ({ isVisible }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  const handleKeyClick = (key: string) => {
    const event = new KeyboardEvent("keydown", { key });
    window.dispatchEvent(event);
  };

  if (!isClient || !isVisible) return null;

  return (
    <Draggable
      // @ts-ignore
      nodeRef={nodeRef}
      positionOffset={{ x: -100, y: -200 }}
    >
      <div
        ref={nodeRef}
        className="glass w-fit group flex justify-center items-center backdrop-blur transition duration-300 ease-in-out"
        style={{
          cursor: "move",
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 !w-8 rounded-l-md !cursor-move"></div>{" "}
        <div className="grid grid-cols-4 items-center justify-center gap-2 p-4 max-w-[30rem] ml-5">
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
    </Draggable>
  );
};

export default KeyBoard;
