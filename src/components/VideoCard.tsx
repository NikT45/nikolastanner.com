import { Ellipsis, EllipsisVertical, Mic, SquareUserRound, Video } from "lucide-react";

export default function VideoCard() {
    return (
        <div className="max-w-[460px] rounded-lg relative">
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
                    <button className="text-white border-1 border-white rounded-full p-3 text-[14px] font-medium mb-4 cursor-pointer" >
                        <Mic size={16} strokeWidth={2.5} />
                    </button>
                    <button className="text-white border-1 border-white rounded-full p-3 text-[14px] font-medium mb-4 cursor-pointer" >
                        <Video size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <div>
                    <button className="text-white border-1 border-white rounded-full p-3 text-[14px] font-medium mb-4 cursor-pointer" >
                    <SquareUserRound size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    )
}