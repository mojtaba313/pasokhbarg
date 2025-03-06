"use client";

import {
  Cog6ToothIcon,
  CursorArrowRaysIcon,
  CursorArrowRippleIcon,
  MoonIcon,
  SunIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import AnimatedCursor from "react-animated-cursor";
import KeyBoard from "../KeyBoard";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mouseRipple, setMouseRipple] = useState(true);
  const [isKeyBoardVisible, setIsKeyBoardVisible] = useState(false);

  useEffect(() => {
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDarkMode);
    updateDarkMode(isDarkMode);

    const isMouseRipple = localStorage.mouse !== "no-ripple";
    setMouseRipple(isMouseRipple);
    updateMouseRipple(isMouseRipple);
  }, []);

  const updateDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  const updateMouseRipple = (isRipple: boolean) => {
    if (isRipple) {
      localStorage.mouse = "ripple";
      document.body.classList.remove("default-cursor");
    } else {
      localStorage.mouse = "no-ripple";
      document.body.classList.add("default-cursor");
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateDarkMode(newDarkMode);
  };

  const toggleMouseRipple = () => {
    setMouseRipple((prev) => {
      updateMouseRipple(!prev);
      return !prev;
    });
  };

  const toggleKeyBoard = () => setIsKeyBoardVisible((prev) => !prev);

  return (
    <>
      {/* دکمه تنظیمات */}
      <div
        className="fixed bottom-4 left-4 rounded-full text-blue-600 bg-white dark:bg-gray-800 shadow-lg flex justify-center items-center w-14 h-14 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-300 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Cog6ToothIcon
          width={30}
          className="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* پنل تنظیمات */}
      <div
        className={`fixed z-30 bottom-20 left-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* دکمه تغییر دارک مود */}
        <button
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon width={24} className="text-yellow-400" />
          ) : (
            <MoonIcon width={24} className="text-gray-800 dark:text-gray-200" />
          )}
        </button>

        {/* Mouse */}
        <button
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={toggleMouseRipple}
          aria-label="Toggle dark mode"
        >
          {mouseRipple ? (
            <CursorArrowRaysIcon
              width={24}
              className="text-gray-800 dark:text-gray-200"
            />
          ) : (
            <CursorArrowRippleIcon width={24} className="text-yellow-400" />
          )}
        </button>

        {/* KeyBoard */}
        <button
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={toggleKeyBoard}
          aria-label="Toggle dark mode"
        >
          <WindowIcon
            width={24}
            className={`${
              isKeyBoardVisible
                ? "text-gray-800 dark:text-gray-200"
                : "text-yellow-400"
            }`}
          />
        </button>
      </div>
      {mouseRipple ? (
        <AnimatedCursor
          showSystemCursor
          innerSize={12}
          outerSize={24}
          color="#002fff41"
          outerAlpha={0.5}
          innerScale={0.8}
          outerScale={4}
          innerStyle={{
            backgroundColor: "#002fff",
            borderRadius: "50%",
            animation: "pulse 1.5s infinite",
          }}
          outerStyle={{
            border: "2px solid #002fff",
          }}
          clickables={[
            "a",
            "input[type='text']",
            "input[type='email']",
            "input[type='number']",
            "input[type='submit']",
            "input[type='image']",
            "label[for]",
            "select",
            "textarea",
            "button",
            ".link",
          ]}
        />
      ) : (
        <div className="default-cursor"></div>
      )}

      <KeyBoard isVisible={isKeyBoardVisible} />
    </>
  );
};

export default Settings;
