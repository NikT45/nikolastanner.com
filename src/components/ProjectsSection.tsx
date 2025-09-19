"use client";

import projectsData from "@/data/projects.json";

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

export default function ProjectsSection() {
  const projects: Project[] = projectsData;

  return (
    <section className="relative z-20 w-full py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-medium mb-12">
          Projects
        </h2>

        <div className="space-y-12">
          {projects.map((project) => (
            <div key={project.id} className="border-b border-gray-200 pb-8 last:border-b-0">
              <h3 className="text-xl md:text-2xl font-medium mb-3">
                {project.title}
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
        </div>
      </div>
    </section>
  );
}