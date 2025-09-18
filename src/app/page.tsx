"use client";

import HomePage from "@/components/HomePage";
import Dither from "@/components/Dither";
import FormalityToggle from "@/components/FormalityToggle";

export default function Home() {

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: '#F7FCFE' }}>
            <>
            <div className="absolute z-0 inset-0 h-full w-full">
                <Dither
                  waveColor={[0, 0, 1]}
                  disableAnimation={false}
                  enableMouseInteraction={false}
                  mouseRadius={0.3}
                  colorNum={4}
                  waveAmplitude={0.3}
                  waveFrequency={3}
                  waveSpeed={0.01}
                  opacity={0.25}
                />
              </div>
            <div className="absolute z-10 inset-0 h-full w-full bg-gradient-to-b to-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, #F7FCFE, transparent)' }}></div>
            <div className="relative flex z-20 justify-center pt-32">
                <div className="flex flex-col items-center">
                    {/*<h1 className="font-semibold text-[40px]">Nik Tanner</h1>*/}
                    <FormalityToggle />
                </div>

            {/*<p className="text-[128px]">hi</p>*/}
            </div>

            {/*<HomePage />*/}
            </>
        </div>
    );
}
