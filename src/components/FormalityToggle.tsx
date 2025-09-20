"use client";

import { useState, useEffect } from "react";
import { useFormal } from "@/contexts/FormalContext";

export default function FormalityToggle() {
  const { isFormal, setIsFormal } = useFormal();
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowTooltip(false);
    };

    const handleClick = () => {
      setShowTooltip(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleToggleClick = () => {
    setIsFormal(!isFormal);
    setShowTooltip(false);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="relative flex items-center gap-2">
      <div
        className="relative border-1 border-dark flex items-center cursor-pointer"
        style={{ backgroundColor: '#F7FCFE' }}
        onClick={handleToggleClick}
      >
        <div
          className={`absolute bg-dark w-1/2 h-full transition-transform duration-300 ease-in-out ${
            isFormal ? 'translate-x-0' : 'translate-x-full'
          }`}
        ></div>
        <div className="flex w-full relative z-10">
          <span className={`px-2 py-1 font-semibold text-xs transition-colors duration-300 flex-1 text-center ${
            isFormal ? 'text-white' : 'text-dark'
          }`}>Formal</span>
          <span className={`px-2 py-1 font-semibold text-xs transition-colors duration-300 flex-1 text-center ${
            !isFormal ? 'text-white' : 'text-dark'
          }`}>Informal</span>
        </div>
      </div>

      {/* Info icon */}
      <button
        onClick={handleInfoClick}
        className="w-4 h-4 rounded-full border border-dark flex items-center justify-center text-xs font-medium hover:bg-gray-100 transition-colors cursor-pointer"
        style={{ backgroundColor: '#F7FCFE' }}
      >
        i
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-sm p-4 rounded-lg shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-300"
             style={{ backgroundColor: '#F7FCFE' }}>
          <div className="relative">
            <div className="absolute -top-6 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-200"></div>
            <div className="absolute -top-5 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent"
                 style={{ borderBottomColor: '#F7FCFE' }}></div>
          </div>
          <h4 className="font-semibold text-sm mb-2 text-dark">What&apos;s this?</h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            I strongly dislike the sterility of portfolios and professional portrayals. Perhaps I am young and naive but I believe heavily in team dynamics contributing to more efficient group work and better outcomes. So I made this toggle as a way to portray a realer version of myself.
          </p>
        </div>
      )}
    </div>
  );
}
