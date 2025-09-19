"use client";

import { useState, useEffect, useRef } from "react";
import projectsData from "@/data/projects.json";
import experienceData from "@/data/experience.json";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

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
    <span ref={ref} className="block">
      {children.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-opacity transition-transform duration-500 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: isVisible ? `${index * 30}ms` : '0ms'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

export default function ProjectsSection() {
  const projects: Project[] = projectsData;
  const experience: Experience[] = experienceData;
  const [activeTab, setActiveTab] = useState<'projects' | 'experience'>('projects');

  return (
    <section className="relative z-20 w-full">
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-baseline gap-8 mb-12 h-[42px] md:h-[50px] lg:h-[60px]">
          <button
            onClick={() => setActiveTab('projects')}
            className={`font-medium transition-all duration-300 relative cursor-pointer opacity-0 animate-in fade-in slide-in-from-bottom-4 ${
              activeTab === 'projects'
                ? 'text-[28px] md:text-[36px] lg:text-[42px] text-black'
                : 'text-[24px] md:text-[28px] lg:text-[32px] text-gray-600 hover:text-black'
            }`}
            style={{ minWidth: 'max-content', animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <span className="block">Projects</span>
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
              activeTab === 'projects' ? 'w-full' : 'w-0'
            }`}></span>
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`font-medium transition-all duration-300 relative cursor-pointer opacity-0 animate-in fade-in slide-in-from-bottom-4 ${
              activeTab === 'experience'
                ? 'text-[28px] md:text-[36px] lg:text-[42px] text-black'
                : 'text-[24px] md:text-[28px] lg:text-[32px] text-gray-600 hover:text-black'
            }`}
            style={{ minWidth: 'max-content', animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <span className="block">Experience</span>
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
              activeTab === 'experience' ? 'w-full' : 'w-0'
            }`}></span>
          </button>
        </div>

        <div className="space-y-12" key={activeTab}>
          {activeTab === 'projects' && projects.map((project, index) => (
            <div key={project.id} className="border-b border-gray-200 pb-8 last:border-b-0">
              <h3 className="text-xl md:text-2xl font-medium mb-3">
                <TextSplit delay={index * 100}>{project.title}</TextSplit>
              </h3>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    {tech}{index < project.technologies.length - 1 && ", "}
                  </span>
                ))}
              </div>

              <div className="flex gap-6 text-sm">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors underline"
                >
                  View on GitHub
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors underline"
                >
                  Live Demo
                </a>
              </div>
            </div>
          ))}

          {activeTab === 'experience' && experience.map((exp, index) => (
            <div key={exp.id} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium">
                    <TextSplit delay={index * 100}>{exp.position}</TextSplit>
                  </h3>
                  <h4 className="text-lg md:text-xl text-gray-700 mb-2">
                    <TextSplit delay={index * 100 + 200}>{exp.company}</TextSplit>
                  </h4>
                </div>
                <div className="text-sm md:text-base text-gray-600 md:text-right">
                  <p>{exp.duration}</p>
                  <p>{exp.location}</p>
                </div>
              </div>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                {exp.description}
              </p>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-800 mb-2">Key Achievements:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    {tech}{index < exp.technologies.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
