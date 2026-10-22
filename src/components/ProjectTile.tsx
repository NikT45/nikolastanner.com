"use client";

import { useEffect, useRef } from "react";

export interface ProjectTileData {
  name: string;
  desc: string;
  /* Looping product demo, 16:9, muted. Exported from the Figma motion tiles. */
  video: string;
  /* First frame of the demo, shown before playback and for reduced-motion. */
  poster: string;
  href?: string;
}

/* Each tile plays only while on screen so four looping videos don't compete
   for decode time, and stays on its poster when the visitor prefers reduced
   motion. */
export default function ProjectTile({ project }: { project: ProjectTileData }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const art = (
    <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-bg-subtle">
      <video
        ref={ref}
        src={project.video}
        poster={project.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${project.name} demo`}
        className="h-full w-full object-cover"
      />
    </div>
  );

  const title = project.href ? (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border-b border-underline pb-px no-underline transition-colors duration-200 hover:border-accent hover:text-accent group-hover:border-accent group-hover:text-accent"
    >
      {project.name}
    </a>
  ) : (
    project.name
  );

  return (
    <div className="group flex flex-col gap-3">
      {project.href ? (
        <a href={project.href} target="_blank" rel="noopener noreferrer" className="block">
          {art}
        </a>
      ) : (
        art
      )}
      <div className="flex flex-col gap-1">
        <p className="text-[1.05rem] font-normal tracking-[0.01em] text-text">{title}</p>
        <p className="text-[0.875rem] leading-[1.5] tracking-[0.04em] text-text-mid">{project.desc}</p>
      </div>
    </div>
  );
}
