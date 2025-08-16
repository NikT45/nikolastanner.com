"use client"
import { Ellipsis, EllipsisVertical, Mic, SquareUserRound, Video, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function VideoCard() {
    const [clickCount, setClickCount] = useState(0);
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        setClickCount(prevCount => prevCount + 1);
        setShowMessage(true);
    };

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer);
        }
    }, [showMessage]);
    return (
        <div className="flex flex-col">
            <div className="max-w-[720px] rounded-lg relative">
                <div className="w-full aspect-video rounded-lg overflow-hidden">
                    <video src="/loopedvid.mp4" className="w-full h-full object-cover rounded-lg" autoPlay loop muted />
                </div>
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)'
                    }}>
                </div>
                {/* Top flex row overlay */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4 rounded-t-lg z-10">
                    <a className="text-white text-[14px] font-medium" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Nikolas Tanner</a>
                    <EllipsisVertical size={20} strokeWidth={2} className="text-white" />
                </div>
                {/* Bottom flex row overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between rounded-b-lg z-10 p-4">
                    <div className="flex items-center justify-between bg-[#2B79E2] rounded-full p-0.5">
                        <Ellipsis size={16} strokeWidth={2.5} className="text-white" />
                    </div>
                    <div className="flex items-center gap-4 justify-between rounded-full p-0.5">
                        <button onClick={handleClick} className="text-white border-1 border-white rounded-full p-3 text-[14px] font-medium mb-4 cursor-pointer" >
                            <Mic size={16} strokeWidth={2.5} />
                        </button>
                        <button onClick={handleClick} className="text-white border-1 border-white rounded-full p-3 text-[14px] font-medium mb-4 cursor-pointer" >
                            <Video size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div>
                        <button onClick={handleClick} className="text-white border-1 border-white rounded-full p-3 text-[14px] font-medium mb-4 cursor-pointer" >
                            <SquareUserRound size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
            {/* New flex row under the video card */}
            <div className="flex items-center justify-center p-4 mt-2 gap-6">
                <button onClick={handleClick} className="flex flex-row items-center justify-items-center gap-2 cursor-pointer">
                    <Mic size={16} strokeWidth={2} className="text-gray-600" />
                    <p className="text-gray-600 text-[.875rem] font-medium" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Tanner's airpo...</p>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
                <button onClick={handleClick} className="flex flex-row items-center justify-items-center gap-2 cursor-pointer">
                    <Volume2 size={16} strokeWidth={2} className="text-gray-600" />
                    <p className="text-gray-600 text-[.875rem] font-medium" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>Tanner's airpo...</p>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
                <button onClick={handleClick} className="flex flex-row items-center justify-items-center gap-2 cursor-pointer">
                    <Video size={16} strokeWidth={2} className="text-gray-600" />
                    <p className="text-gray-600 text-[.875rem] font-medium" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>USB Camera V...</p>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
            </div>
                         <div className="relative">
                 <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 flex max-w-[600px] text-center flex-row items-center justify-items-center gap-2 transition-opacity duration-500 ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
                     <p className="text-black text-[.875rem] font-medium" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>
                         {clickCount === 1 ? "None of these buttons do anything. If you couldn't tell, the video is just a loop." : "Why are you still clicking these? You should be clicking the big blue button."}
                     </p>
                 </div>
             </div>
        </div>
    )
}