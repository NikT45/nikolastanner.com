

export default function VideoCard() {   
    return (
        <div className="max-w-[460px] rounded-lg relative">
            <div className="w-full h-full rounded-lg">
                <video src="/loopedvid.mp4" width={576} height={576} className="w-full h-full object-cover rounded-lg" autoPlay loop muted />
            </div>
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-lg" 
                 style={{
                     background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)'
                 }}>
            </div>
        </div>
    )
}