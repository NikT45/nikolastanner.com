"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Dither from "@/components/Dither";
import FormalityToggle from "@/components/FormalityToggle";
import ProjectsSection from "@/components/ProjectsSection";
import { useFormal } from "@/contexts/FormalContext";
import GitHubCalendar from 'react-github-calendar';

interface Activity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const selectLastHalfYear = (contributions: Activity[]) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const shownMonths = 6;

  return contributions.filter(activity => {
    const date = new Date(activity.date);
    const monthOfDay = date.getMonth();

    return (
      date.getFullYear() === currentYear &&
      monthOfDay > currentMonth - shownMonths &&
      monthOfDay <= currentMonth
    );
  });
};

function TextSplit({ children, delay = 0 }: { children: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <span ref={ref} className="inline-block">
      {children.split(' ').map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: isVisible ? `${index * 50}ms` : '0ms'
          }}
        >
          {word}{index < children.split(' ').length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}

function ImageFadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
      }`}
    >
      {children}
    </div>
  );
}

export default function Home() {
    const { isFormal } = useFormal();

    return (
        <div className="min-w-full" style={{ backgroundColor: '#F7FCFE' }}>
            <>
            {/* Formality toggle - positioned at top above everything 
            <div className="fixed z-30 top-8 right-4 md:right-8 lg:right-16">
                <FormalityToggle />
            </div> */}
            <div className="fixed z-0 inset-0 h-screen w-screen">
                <Dither
                  waveColor={[0, 0, 1]}
                  disableAnimation={false}
                  enableMouseInteraction={false}
                  mouseRadius={0.3}
                  colorNum={4}
                  waveAmplitude={0.3}
                  waveFrequency={3}
                  waveSpeed={0.01}
                  opacity={0.2}
                />
              </div>
            <div className="fixed z-10 inset-0 h-[300px] w-screen bg-gradient-to-b to-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, #F7FCFE, transparent)' }}></div>

            {/* Main content - full screen height, centered */}
            <div className="relative z-20 h-screen flex justify-center items-center">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                            {/* Text content on the left */}
                            <div className="flex-1 text-center md:text-left max-w-3xl">
                                <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-medium mb-4 leading-tight">
                                    <TextSplit delay={200}>
                                        {isFormal ? "Hello, I'm Nik!" : "Hey, I'm Nik!"}
                                    </TextSplit>
                                </h1>
                                <div className="text-sm md:text-base lg:text-lg text-gray-800 leading-relaxed">
                                    <TextSplit delay={0}>
                                        {isFormal ?
                                        "I'm Taiwanese American, grew up in Beijing, and now I'm a junior Computer Science student at Fordham. I'm a builder who loves turning ideas into real, working products, and I spend a lot of my time hacking on side projects, competing in hackathons, and experimenting with new tools and technologies." :
                                        "I'm a Taiwanese American computer fanatic that grew up in Beijing. I've been into tech for as long as I can remember. After all, no one holds your hand trouble-shooting a locally hosted Minecraft server (pre ai too lol). When I was young I loved learning and tinkering, whether it was 3D Minecraft animations in Blender, modding Minecraft, or building my first desktop, I was chronically online. These days I channel a lot of that energy into programming and spend a majority of time hacking on side projects, competing in hackathons, and experimenting with new tools and technologies." }
                                    </TextSplit>
                                </div>
                            </div>

                            {/* Image on the right */}
                            <div className="flex-shrink-0">
                                <ImageFadeIn delay={600}>
                                    <div className="relative">
                                        <Image
                                            src={isFormal ? "/formal.jpg" : "/informal.JPG"}
                                            alt={isFormal ? "Formal" : "Informal"}
                                            width={384}
                                            height={384}
                                            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-xl"
                                        />
                                        {!isFormal && (
                                            <div className="absolute -bottom-6 left-0 right-0 text-center">
                                                <span className="text-xs text-gray-500 italic">
                                                    (Building on a friends floor in LA)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </ImageFadeIn>
                            </div>
                        </div>
                    </div>
                </div>


            {/* Projects Section */}
            <ProjectsSection />

            <div className="relative z-20 flex justify-center items-center py-6 px-4 md:px-8">
            <GitHubCalendar
            username="NikT45"
            colorScheme='light'
            transformData={selectLastHalfYear}
            theme={{
                light: ['#f0f4ff', '#a5b4fc', '#6366f1', '#4f46e5', '#3730a3']
            }}
            labels={{
                totalCount: '{{count}} contributions in the last half year'
            }}
            />
            </div>

            {/*<HomePage />*/}
            </>
        </div>
    );
}
