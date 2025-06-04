"use client";

import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { useState, useRef, useEffect } from "react";

interface MultiSelectProps<T> {
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  optionLabel: keyof T;
  display?: "chip" | "comma";
  filter?: boolean;
  placeholder?: string;
  className?: string;
}

export function MultiSelect<T>({
  options,
  value,
  onChange,
  optionLabel,
  display = "chip",
  filter = false,
  placeholder = "Select items...",
  className = "",
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    String(option[optionLabel]).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option: T) => {
    const isSelected = value.some(
      (item) => JSON.stringify(item) === JSON.stringify(option)
    );

    if (isSelected) {
      onChange(
        value.filter((item) => JSON.stringify(item) !== JSON.stringify(option))
      );
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option: T) => {
    onChange(
      value.filter((item) => JSON.stringify(item) !== JSON.stringify(option))
    );
  };

  const chooseAll = () => {
    if (value.length === filteredOptions.length) {
      onChange([]);
    } else {
      onChange([...filteredOptions]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input و نمایش آیتم‌های انتخاب شده */}
      <div
        className={`flex flex-wrap items-center gap-2 p-2 border rounded-lg cursor-pointer min-h-[42px] ${
          isOpen
            ? "ring-2 ring-blue-500 border-blue-500"
            : "border-gray-300 dark:border-gray-600"
        } bg-white dark:bg-gray-800`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-400">
            {placeholder}
          </span>
        ) : display === "chip" ? (
          value.map((option, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 rounded-full"
            >
              {String(option[optionLabel])}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
                className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm">
            {value.map((option) => String(option[optionLabel])).join(", ")}
          </span>
        )}
        <div className="ml-auto flex items-center">
          {value.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <span className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-2"></span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            } text-gray-500 dark:text-gray-300`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 top-full">
          {/* Search input */}
          {filter && (
            <div className="flex gap-3 p-2 border-b border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                className="max-w-min !bg-slate-700 focus:!bg-blue-600"
                onClick={chooseAll}
              >
                همه
              </Button>
              <input
                type="text"
                placeholder="جست و جو..."
                className="flex-grow w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto max-h-60">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-center text-gray-500 dark:text-gray-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value.some(
                  (item) => JSON.stringify(item) === JSON.stringify(option)
                );

                return (
                  <div
                    key={index}
                    className={`flex items-center p-2 cursor-pointer ${
                      isSelected
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => toggleOption(option)}
                  >
                    {/* <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-2 rounded text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                    /> */}
                    <Checkbox
                      readOnly
                      checked={isSelected}
                      // className="mr-2 rounded text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                      className="rounded overflow-hidden bg-slate-600 checked:bg-blue-600 mx-2"
                    />
                    <span className="text-sm dark:text-white">
                      {String(option[optionLabel])}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
