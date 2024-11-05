"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/theme/theme";
import { Input } from "@/components/ui/input"; // Custom Input component
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/constants/categories";

interface CategoryAutocompleteProps {
  categories: Category[];
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

export function CategoryAutocomplete({
  categories,
  selectedCategories,
  setSelectedCategories,
}: CategoryAutocompleteProps) {
  const { colorMode } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [focusedPillIndex, setFocusedPillIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const highlightedItemRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filter categories based on input value and exclude already selected categories
  const filteredCategories = categories.filter(
    (category) =>
      category.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedCategories.includes(category as Category)
  );

  const addCategory = (category: Category) => {
    setSelectedCategories([...selectedCategories, category]);
    setInputValue("");
    setHighlightedIndex(0);
    setFocusedPillIndex(null);
  };

  const removeCategory = (index: number) => {
    const newCategories = [...selectedCategories];
    newCategories.splice(index, 1);
    setSelectedCategories(newCategories);
    setFocusedPillIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && inputValue === "") {
      if (focusedPillIndex !== null) {
        // Remove the currently focused pill
        removeCategory(focusedPillIndex);
      } else if (selectedCategories.length > 0) {
        // Focus the last pill if no pill is currently focused
        setFocusedPillIndex(selectedCategories.length - 1);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedPillIndex(null);
        setHighlightedIndex((prevIndex) =>
          prevIndex === filteredCategories.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedPillIndex(null);
        setHighlightedIndex((prevIndex) =>
          prevIndex === 0 ? filteredCategories.length - 1 : prevIndex - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCategories[highlightedIndex]) {
          addCategory(filteredCategories[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsFocused(false);
        setHighlightedIndex(0);
        setFocusedPillIndex(null);
        break;
    }
  };

  // Ensure the highlighted item is visible when navigating with the keyboard
  useEffect(() => {
    if (highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  // Focus the input when clicking on the wrapper
  const handleWrapperClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
    setFocusedPillIndex(null);
  };

  return (
    <div
      className={cn(
        "relative flex items-center flex-wrap gap-2 border rounded-md px-2 py-2",
        colorMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300"
      )}
      onClick={handleWrapperClick} // Focus input on wrapper click
    >
      {selectedCategories.map((category, index) => (
        <span
          key={category}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-all",
            focusedPillIndex === index
              ? colorMode === "dark"
                ? "border-primary bg-gray-700 text-white"
                : "border-primary bg-gray-200 text-gray-800"
              : colorMode === "dark"
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-200 text-gray-800 border-gray-300",
            focusedPillIndex === index ? "ring-2 ring-primary" : ""
          )}
          tabIndex={-1} // Allows the pill to be focusable programmatically
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPillIndex(index);
            inputRef.current?.focus();
          }}
        >
          {category}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeCategory(index);
            }}
            className="focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </span>
      ))}

      {/* Custom Input for filtering categories */}
      <Input
        ref={inputRef} // Attach ref to the input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setHighlightedIndex(0);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicks on dropdown
        onKeyDown={handleKeyDown}
        placeholder={selectedCategories.length ? "" : "Filter by category"}
        className="flex-1 min-w-[120px] border-none outline-none focus:ring-0 focus:border-transparent"
      />

      {/* Dropdown for filtered category suggestions */}
      {isFocused && filteredCategories.length > 0 && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 mt-2 w-full max-h-40 overflow-y-auto rounded-md shadow-lg z-10",
            colorMode === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          )}
        >
          {filteredCategories.map((category, index) => (
            <button
              key={category}
              ref={index === highlightedIndex ? highlightedItemRef : null}
              onClick={() => addCategory(category as Category)}
              className={cn(
                "w-full text-left px-4 py-2",
                highlightedIndex === index
                  ? colorMode === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-200"
                  : "",
                "hover:bg-gray-100 transition-colors",
                colorMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
