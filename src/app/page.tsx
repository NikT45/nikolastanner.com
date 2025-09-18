"use client";

import HomePage from "@/components/HomePage";
import Dither from "@/components/Dither";
import { useFormal } from "@/contexts/FormalContext";

export default function Home() {
    const { isFormal, setIsFormal } = useFormal();

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
                </div>

            {/*<p className="text-[128px]">hi</p>*/}
            </div>

            {/*<HomePage />*/}
            </>
        </div>
    );
}
