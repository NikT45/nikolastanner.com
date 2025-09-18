"use client";

import { useFormal } from "@/contexts/FormalContext";

export default function FormalityToggle() {
  const { isFormal, setIsFormal } = useFormal();

  return (
    <div
      className="relative border-2 border-black flex items-center cursor-pointer"
      onClick={() => setIsFormal(!isFormal)}
    >
      <div
        className={`absolute bg-black w-1/2 h-full transition-transform duration-300 ease-in-out ${
          isFormal ? 'translate-x-0' : 'translate-x-full'
        }`}
      ></div>
      <div className="flex w-full relative z-10">
        <span className={`px-4 py-2 font-semibold text-xs transition-colors duration-300 flex-1 text-center ${
          isFormal ? 'text-white' : 'text-black'
        }`}>Formal</span>
        <span className={`px-4 py-2 font-semibold text-xs transition-colors duration-300 flex-1 text-center ${
          !isFormal ? 'text-white' : 'text-black'
        }`}>Informal</span>
      </div>
    </div>
  );
}