"use client";

import { Grid2x2, RectangleHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

export interface SplitProject {
  name: string;
  desc: string;
  /* Looping product demo, 16:9, muted. Exported from the Figma FINAL tiles. */
  video: string;
  /* First frame of the demo, shown before playback and for reduced-motion. */
  poster: string;
  href: string;
  /* Display form of the link, e.g. "usenimbit.com". */
  linkLabel: string;
}

type View = "split" | "grid";

/* On desktop both views are wider than the 640px reading column and
   centred on it, capped so they never overflow the viewport gutters. They
   share the width so a toggle never moves the heading or the switch. */
const WIDE = "lg:mx-[calc((640px-var(--split))/2)] lg:w-[var(--split)]";
const WIDE_VARS = { "--split": "min(1120px, 100vw - 48px)" };

/* Two layouts behind a switch beside the heading. The default is the
   sticky split; the other is a static two-column grid of every demo. */
export default function ProjectsSplit({
  heading,
  projects,
}: {
  /* Section label. In the split view it fades once the first demo has
     settled into its resting position, and returns on the way back up. */
  heading: string;
  projects: SplitProject[];
}) {
  const [view, setView] = useState<View>("split");
  /* Only a view that arrives by a toggle animates in, not the first one. */
  const [toggled, setToggled] = useState(false);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(false);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  /* One pass of rect reads per scroll frame: the active demo is the one
     whose centre is nearest the viewport's midline (where demos rest), and
     the heading goes once the first demo's centre has risen to just below
     that line. The grid has nothing to track. */
  useEffect(() => {
    if (view !== "split") return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        /* Measure the video, not its viewport-tall slot. */
        const r = (el.firstElementChild ?? el).getBoundingClientRect();
        const centre = r.top + r.height / 2;
        const dist = Math.abs(centre - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
        if (i === 0) setSettled(centre <= window.innerHeight * 0.55);
      });
      setActive(best);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [view]);

  const choose = (next: View) => {
    if (next === view) return;
    setView(next);
    setToggled(true);
  };

  /* The switch fades with the heading, but comes back while it holds
     keyboard focus so it is never focused and invisible. */
  const faded = view === "split" && settled;

  return (
    <>
      <div
        className={`mb-10 flex transition-[opacity,filter] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none lg:justify-center ${
          faded
            ? "lg:not-has-focus-visible:pointer-events-none lg:not-has-focus-visible:opacity-0 lg:not-has-focus-visible:blur-[6px]"
            : "opacity-100 blur-0"
        }`}
      >
        {/* The switch hangs off the heading's right edge, so the heading
            stays exactly centred on desktop. */}
        <div className="relative">
          <p className="text-[1.4rem] font-light text-accent-deep">{heading}</p>
          <ViewToggle
            view={view}
            onChange={choose}
            className="absolute top-1/2 left-full ml-3 -translate-y-1/2"
          />
        </div>
      </div>

      <div
        key={view}
        className={toggled ? "animate-view-in motion-reduce:animate-none" : undefined}
      >
        {view === "split" ? (
          <SplitView projects={projects} active={active} items={items} />
        ) : (
          <GridView projects={projects} />
        )}
      </div>
    </>
  );
}

/* Sticky split. On desktop the first demo sits a normal 40px under the
   heading, so the section opens like every other section. Each demo then
   gets a viewport-tall slot, and the left column (sized to the video) pins
   at the position where a demo rests centred in the viewport. It rides with
   the first video on the way in and the last on the way out, so the text
   is always beside a demo. Below lg the layout stacks and each demo carries
   its own text. */
function SplitView({
  projects,
  active,
  items,
}: {
  projects: SplitProject[];
  active: number;
  items: RefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    /* The video height and the resting offset are derived from the width
       so the pinned text column is exactly the video's height. */
    <div
      className={`lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-20 ${WIDE}`}
      style={
        {
          ...WIDE_VARS,
          "--video-h": "calc((var(--split) - 400px) * 9 / 16)",
          "--rest-top": "calc(50vh - var(--video-h) / 2)",
        } as CSSProperties
      }
    >
      {/* All entries share one grid cell so the column never changes height
          while the active one blurs in. */}
      <aside
        className="sticky top-[var(--rest-top)] hidden h-[var(--video-h)] content-center self-start lg:grid"
        aria-live="polite"
      >
        {projects.map((p, i) => {
          const on = i === active;
          return (
            <div
              key={p.name}
              aria-hidden={!on}
              /* will-change keeps the text on one compositing layer for its
                 whole life, so antialiasing never switches when the blur
                 lands on zero (that switch reads as a one-frame snap). */
              className={`col-start-1 row-start-1 flex flex-col gap-4 transition-[opacity,filter] duration-700 ease-[var(--ease-out)] will-change-[opacity,filter] motion-reduce:transition-none ${
                on
                  ? "opacity-100 blur-0"
                  : "pointer-events-none opacity-0 blur-[6px]"
              }`}
            >
              <p className="text-[1.4rem] leading-[1.25] tracking-[0.01em] text-text">
                {p.name}
              </p>
              <p className="text-[0.9375rem] leading-[1.6] font-light tracking-[0.02em] text-text-mid">
                {p.desc}
              </p>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={on ? 0 : -1}
                className="self-start border-b border-text-dim/50 pb-px text-[0.8125rem] leading-[1.5] tracking-[0.06em] text-text-dim no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {p.linkLabel}
              </a>
            </div>
          );
        })}
      </aside>

      {/* Every slot but the last is viewport-tall with its video at the top,
          so consecutive demos are exactly one screen apart. The last slot is
          just its video, so the section ends right after it. */}
      <div className="flex flex-col gap-16 lg:gap-0">
        {projects.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => {
              items.current[i] = el;
            }}
            className={`flex flex-col gap-2.5 ${i < projects.length - 1 ? "lg:min-h-screen" : ""}`}
          >
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <DemoVideo project={p} />
            </a>
            <Caption project={p} className="lg:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Static grid: every demo at once, two across from sm up, each with its
   name and blurb underneath. Hovering a tile lights its name. */
function GridView({ projects }: { projects: SplitProject[] }) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-14 ${WIDE}`}
      style={WIDE_VARS as CSSProperties}
    >
      {projects.map((p) => (
        <div key={p.name} className="group flex flex-col gap-2.5">
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <DemoVideo project={p} />
          </a>
          <Caption project={p} />
        </div>
      ))}
    </div>
  );
}

/* Name and blurb under a demo: the stacked split below lg, and every tile
   of the grid. */
function Caption({
  project: p,
  className = "",
}: {
  project: SplitProject;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <p className="text-[1.05rem] tracking-[0.01em] text-text">
        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-underline pb-px no-underline transition-colors duration-200 group-hover:border-accent group-hover:text-accent hover:border-accent hover:text-accent"
        >
          {p.name}
        </a>
      </p>
      <p className="text-[0.9375rem] leading-[1.6] font-light tracking-[0.02em] text-text-mid">
        {p.desc}
      </p>
    </div>
  );
}

/* Two-way switch: the scrolling split or the static grid. Hidden below sm,
   where both views are the same single stacked column. */
function ViewToggle({
  view,
  onChange,
  className = "",
}: {
  view: View;
  onChange: (view: View) => void;
  className?: string;
}) {
  const options = [
    { value: "split", label: "scrolling view", Icon: RectangleHorizontal },
    { value: "grid", label: "grid view", Icon: Grid2x2 },
  ] as const;

  return (
    <div
      role="group"
      aria-label="projects layout"
      className={`hidden items-center gap-0.5 sm:inline-flex ${className}`}
    >
      {options.map(({ value, label, Icon }) => {
        const on = view === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={on}
            aria-label={label}
            title={label}
            className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:outline-none ${
              on ? "bg-pill text-accent" : "text-text-dim hover:text-accent"
            }`}
          >
            <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

/* Plays only while on screen so the looping videos don't compete for
   decode time, and stays on its poster when the visitor prefers reduced
   motion. */
function DemoVideo({ project }: { project: SplitProject }) {
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

  return (
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
}
