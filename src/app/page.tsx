"use client";

import { useState } from "react";
import VideoCard from "@/components/VideoCard";
import ChessIcon from "@/components/ChessIcon";
import { ChevronDown, ChevronUp, Mail, Copy } from "lucide-react";

export default function Home() {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="flex p-4 flex-col items-center justify-items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row items-center justify-items-center">
        <VideoCard />
        <div className="flex lg:pl-32 lg:pr-24 pt-8 lg:pt-0 flex-col items-center justify-items-center">
          {/* <p className="text-black text-[28px] font-regular" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>I'm cooler in person</p> */}
          <p className="text-[#252525] text-[28px] font-normal text-center" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Wanna skip the slides?</p>
          <p className="text-[#252525] text-[14px] font-medium mt-4" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Get to know me over a call</p>
          <button 
            onClick={() => window.open('https://calendly.com/ntanner2-fordham/30min', '_blank')}
            className="mt-5 w-[240px] bg-[#0B57D0] hover:bg-[#2566D4] hover:shadow-sm/30 text-white font-medium py-4 rounded-full mb-3 sm:mb-4 transition-all text-sm sm:text-base cursor-pointer"
          >
            Schedule a call
          </button>
          
          {/* Expanded options */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showOptions ? 'max-h-32 opacity-100 mb-2' : 'max-h-0 opacity-0'
          }`}>
            <div className={`flex items-center justify-center flex-col gap-2 transform transition-all duration-300 ease-in-out ${
              showOptions ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'
            }`}>
              <div className="flex flex-row items-center  bg-white text-[#0B57D0] hover:bg-[#EFF3FC] font-medium rounded-full transition-all">
                                  <button 
                    onClick={() => window.location.href = 'mailto:ntanner@fordham.edu'}
                    className="flex flex-row items-center gap-2 flex-1 py-2 pl-4 cursor-pointer"
                  >
                    <Mail size={16} strokeWidth={2} className="text-[#0B57D0]" />
                    Email me instead
                  </button>
                <button
                  onClick={() => navigator.clipboard.writeText('ntanner@fordham.edu')}
                  className="flex items-center justify-center w-8 h-8 mx-2 hover:bg-[#D6E4FF] rounded-full cursor-pointer transition-all"
                  title="Copy email address"
                >
                  <Copy size={14} strokeWidth={2} className="text-[#0B57D0]" />
                </button>
              </div>
              <button className="flex flex-row items-center justify-center gap-2 w-[400px] bg-white text-[#0B57D0] hover:bg-[#EFF3FC] font-medium py-3 px-4 rounded-full transition-all cursor-pointer">
                <ChessIcon size={20} strokeWidth={2} className="text-[#0B57D0] flex-shrink-0" />
                <span className="text-[14px] font-medium text-center">Add me on Chess.com and 1v1 me in a 10 minute rapid game while we chat in the chatbox</span>
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className={`mt-4 w-[200px] ${showOptions ? '' : 'border-1 border-gray-600'} bg-white text-[#0B57D0] font-medium py-2 rounded-full mb-3 sm:mb-4 transition-all cursor-pointer flex items-center justify-center gap-2`}
          >
            {showOptions ? 'Show fewer options' : 'Other options'}
            {showOptions ? (
              <ChevronUp size={16} strokeWidth={2} className="text-[#0B57D0]" />
            ) : (
              <ChevronDown size={16} strokeWidth={2} className="text-[#0B57D0]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
