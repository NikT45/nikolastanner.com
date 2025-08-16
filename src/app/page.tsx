"use client";

import VideoCard from "@/components/VideoCard";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex p-4 flex-col items-center justify-items-center justify-center min-h-screen bg-white">
      <div className="flex flex-row items-center justify-items-center">
        <VideoCard />
        <div className="flex pl-32 pr-24 flex-col items-center justify-items-center">
          {/* <p className="text-black text-[28px] font-regular" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>I'm cooler in person</p> */}
          <p className="text-black text-[28px] font-normal text-center" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Wanna skip the slides?</p>
          <p className="text-black text-[14px] font-medium mt-4" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Get to know me over a call</p>
          <button 
            onClick={() => window.open('https://calendly.com/ntanner2-fordham/30min', '_blank')}
            className="mt-5 w-[240px] bg-[#0B57D0] hover:bg-[#2566D4] hover:shadow-sm/30 text-white font-medium py-4 rounded-full mb-3 sm:mb-4 transition-all text-sm sm:text-base cursor-pointer"
          >
            Schedule a call
          </button>
          <button className="mt-4 w-[200px] border-1 border-gray-600 bg-white text-[#0B57D0] font-medium py-2 rounded-full mb-3 sm:mb-4 transition-all  cursor-pointer flex items-center justify-center gap-2">
            Other options
            <ChevronDown size={16} strokeWidth={2} className="text-[#0B57D0]" />
          </button>
        </div>
      </div>
    </div>
  );
}
