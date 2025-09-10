"use client";

import React from "react";

interface AlphabetFilterProps {
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
}

const AlphabetFilter: React.FC<AlphabetFilterProps> = ({
  selectedLetter,
  onLetterChange,
}) => {
  const letters = [
    "Tất cả",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "#",
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-8">
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterChange(letter)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedLetter === letter
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetFilter;
