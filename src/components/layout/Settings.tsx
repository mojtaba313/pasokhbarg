"use client";

import { Cog6ToothIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // بررسی حالت سیستم عامل و localStorage هنگام لود صفحه
  useEffect(() => {
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDarkMode);
    updateDarkMode(isDarkMode);
  }, []);

  // اعمال تغییرات دارک مود به HTML
  const updateDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  // تغییر حالت دارک مود
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateDarkMode(newDarkMode);
  };

  return (
    <>
      {/* دکمه تنظیمات */}
      <div
        className="fixed bottom-4 left-4 rounded-full text-blue-600 bg-white dark:bg-gray-800 shadow-lg flex justify-center items-center w-14 h-14 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-300 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Cog6ToothIcon width={30} className="text-blue-600 dark:text-blue-400" />
      </div>

      {/* پنل تنظیمات */}
      <div
        className={`fixed bottom-20 left-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4 transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
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

        {/* سایر تنظیمات (می‌توانید اضافه کنید) */}
        {/* <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <YourIcon width={24} className="text-gray-800 dark:text-gray-200" />
        </button> */}
      </div>
    </>
  );
};

export default Settings;