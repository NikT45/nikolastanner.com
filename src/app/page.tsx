"use client";

import HomePage from "@/components/HomePage";
import Dither from "@/components/Dither";
import FormalityToggle from "@/components/FormalityToggle";
import { useFormal } from "@/contexts/FormalContext";

export default function Home() {
    const { isFormal } = useFormal();

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

            <div className="relative z-20 pt-32">
                {/* Formality toggle - positioned far out */}
                <div className="absolute top-8 right-4 md:right-8 lg:right-16">
                    <FormalityToggle />
                </div>

                {/* Main content - centered row */}
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                            {/* Text content on the left */}
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-[32px] md:text-[40px] lg:text-[48px] font-medium mb-4">
                                    {isFormal ? "Hello, I'm Nik!" : "Hey, I'm Nik!"}
                                </p>
                                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>

                            {/* Image on the right */}
                            <div className="flex-shrink-0">
                                <img
                                    src={isFormal ? "/formal.JPG" : "/informal.JPG"}
                                    alt={isFormal ? "Formal" : "Informal"}
                                    className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/*<HomePage />*/}
            </>
        </div>
    );
}
