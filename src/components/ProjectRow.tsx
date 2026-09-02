import Image from "next/image";

export interface Project {
  name: string;
  desc: string;
  bg: string;
  shot: string;
  href?: string;
}

/* The frame and screenshot are inset with absolute positioning rather than
   padding + h-full. A percentage height against an aspect-ratio parent does not
   resolve reliably, which let the frame stretch past the tile's bottom edge;
   insetting all four sides pins both dimensions outright.

   Insets are fixed px so the three nested corners stay concentric at any tile
   size. Concentric corners require inner radius = outer radius - inset:
     tile       40px radius
     frame      inset 20px               -> 40 - 20   = 20px radius
     screenshot inset 7px + 0.6px border -> 20 - 7.6  = 12px radius */
const tile = (project: Project) => (
  <div className="group/tile relative aspect-square w-full overflow-hidden rounded-[40px]">
    <Image
      src={project.bg}
      alt=""
      aria-hidden="true"
      fill
      sizes="(min-width: 640px) 320px, 100vw"
      className="pointer-events-none object-cover transition-[filter] duration-500 ease-out group-hover/tile:saturate-[0.7]"
    />
    <div className="absolute inset-[20px] rounded-[20px] border-[0.6px] border-white/40 bg-white/30 backdrop-blur-[2px]">
      <div className="absolute inset-[7px] overflow-hidden rounded-[12px]">
        <Image
          src={project.shot}
          alt={project.name}
          fill
          sizes="(min-width: 640px) 256px, 75vw"
          className="object-cover"
        />
      </div>
    </div>
  </div>
);

export default function ProjectRow({
  project,
  flip = false,
}: {
  project: Project;
  flip?: boolean;
}) {
  const art = tile(project);

  return (
    <div
      className={`group flex flex-col gap-4 sm:items-stretch sm:gap-12 ${
        flip ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <div className="w-full sm:flex-1">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {art}
          </a>
        ) : (
          art
        )}
      </div>
      <div className="flex w-full flex-col justify-center gap-2 pb-6 sm:w-auto sm:flex-1 sm:pb-0">
        <p className="text-[1.2rem] font-normal tracking-[0.01em] text-text">
          {project.href ? (
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
          )}
        </p>
        <p className="text-[0.875rem] leading-[1.5] tracking-[0.04em] text-text-mid">
          {project.desc}
        </p>
      </div>
    </div>
  );
}
