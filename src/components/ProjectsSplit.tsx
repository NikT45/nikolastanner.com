"use client";

import { Grid2x2, Layers } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import ProjectCursor, { type CursorKind } from "./ProjectCursor";

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
  /* Cursor shown in place of the pointer while a mouse is over the demo. */
  cursor?: CursorKind;
}

/* stack: each demo pins beside its text and the next slides up over it.
   grid: every demo at once. */
type View = "stack" | "grid";

/* Key that flips between the views while the section is on screen. */
const SHORTCUT = "v";

/* On desktop both views are wider than the 640px reading column and
   centred on it, capped so they never overflow the viewport gutters. They
   share the width so a toggle never moves the heading or the switch. */
const WIDE = "lg:mx-[calc((640px-var(--split))/2)] lg:w-[var(--split)]";
const WIDE_VARS = { "--split": "min(1120px, 100vw - 48px)" };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* Two layouts behind a switch beside the heading, also flipped with a key.
   The default is the sticky stack; the other is a static two-column grid
   of every demo. */
export default function ProjectsSplit({
  heading,
  projects,
}: {
  /* Section label. In the stack view it fades once the first demo has
     settled into its resting position, and returns on the way back up. */
  heading: string;
  projects: SplitProject[];
}) {
  const [view, setView] = useState<View>("stack");
  /* Only a view that arrives by a toggle animates in, not the first one. */
  const [toggled, setToggled] = useState(false);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(false);
  /* Desktop, where the demos pin and cover each other. Below it they are
     a plain stacked column. */
  const [pinned, setPinned] = useState(false);
  /* The shortcut key is down: its keycap presses in. */
  const [keyHeld, setKeyHeld] = useState(false);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const head = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  /* Set when a switch happens with the heading scrolled away. */
  const jump = useRef(false);

  /* One pass of rect reads per scroll frame. The active demo is the
     topmost one whose top edge has crossed the viewport's midline: on
     desktop, where demos rest centred, that is the one that has covered at
     least half of the demo beneath it. The heading goes once the first
     demo's centre has risen to just below the midline. The grid has
     nothing to track. */
  useEffect(() => {
    if (view !== "stack") return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      /* Measure the videos (wherever they are pinned), not their slots. */
      const videos = items.current.map(
        (el) => (el?.firstElementChild ?? null) as HTMLElement | null,
      );
      const rects = videos.map((el) => el?.getBoundingClientRect() ?? null);
      let top = 0;
      rects.forEach((r, i) => {
        if (!r) return;
        if (i === 0) {
          setSettled(r.top + r.height / 2 <= window.innerHeight * 0.55);
        }
        if (r.top <= mid) top = i;
        /* How much of this demo the next one has slid over, 0 to 1. It
           drives the recede (see StackView) straight from the style, so a
           scroll frame never re-renders for it. */
        const next = rects[i + 1];
        const covered = next
          ? clamp01((r.bottom - next.top) / r.height).toFixed(3)
          : "0";
        const style = videos[i]!.style;
        if (style.getPropertyValue("--covered") !== covered) {
          style.setProperty("--covered", covered);
        }
      });
      setActive(top);
      setPinned(desktop.matches);
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

  const go = useCallback((next: View) => {
    jump.current = (head.current?.getBoundingClientRect().top ?? 0) < 0;
    setView(next);
    setToggled(true);
  }, []);

  /* A switch made from deep inside a view (the heading long gone) would
     land at an arbitrary point of the next one, so it restarts from the
     heading instead. Before paint, so the new view never shows at the old
     scroll position. */
  useLayoutEffect(() => {
    if (!jump.current) return;
    jump.current = false;
    head.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [view]);

  /* The shortcut flips to the other view. It only answers while the section
     is on screen and the switch exists (sm up), never while typing, and
     never as part of a browser or system chord. */
  useEffect(() => {
    const isKey = (e: KeyboardEvent) => e.key.toLowerCase() === SHORTCUT;
    const onDown = (e: KeyboardEvent) => {
      if (!isKey(e) || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.isContentEditable || t.closest("input, textarea, select"))
      ) {
        return;
      }
      if (!window.matchMedia("(min-width: 640px)").matches) return;
      const top = head.current?.getBoundingClientRect().top;
      const bottom = body.current?.getBoundingClientRect().bottom;
      if (top == null || bottom == null) return;
      if (bottom <= 0 || top >= window.innerHeight) return;

      setKeyHeld(true);
      go(view === "stack" ? "grid" : "stack");
    };
    const onUp = (e: KeyboardEvent) => {
      if (isKey(e)) setKeyHeld(false);
    };
    const release = () => setKeyHeld(false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", release);
    };
  }, [view, go]);

  /* The switch fades with the heading, but comes back while it holds
     keyboard focus so it is never focused and invisible. */
  const faded = view === "stack" && settled;

  return (
    <>
      <div
        ref={head}
        className={`mb-10 flex scroll-mt-32 transition-[opacity,filter] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none lg:justify-center ${
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
            onChange={(next) => {
              if (next !== view) go(next);
            }}
            keyHeld={keyHeld}
            className="absolute top-1/2 left-full ml-3 -translate-y-1/2"
          />
        </div>
      </div>

      <div
        key={view}
        ref={body}
        className={toggled ? "animate-view-in motion-reduce:animate-none" : undefined}
      >
        {view === "stack" ? (
          <StackView
            projects={projects}
            active={active}
            pinned={pinned}
            items={items}
          />
        ) : (
          <GridView projects={projects} />
        )}
      </div>

      <ProjectCursor />
    </>
  );
}

/* Sticky stack. On desktop the first demo sits a normal 40px under the
   heading, so the section opens like every other section. Each demo then
   pins centred in the viewport and stays there, and the next slides up
   over it while it recedes (shrinks a touch and fades toward the page).
   Only the demo on top plays. The left column (sized to the video) pins at
   the same resting position for the whole run, riding in with the first
   video and out with the last, so the text is always beside a demo. Below
   lg the layout is a plain column and each demo carries its own text. */
function StackView({
  projects,
  active,
  pinned,
  items,
}: {
  projects: SplitProject[];
  active: number;
  /* Desktop: the demos are pinned over each other, so only one may play. */
  pinned: boolean;
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
          /* Scroll distance a demo rests with nothing else moving, before
             the next one enters at the bottom of the screen. */
          "--quiet": "160px",
          /* Flow distance between demos. The space under a resting demo
             plus the quiet stretch, so the next demo is still off screen
             when this one lands. */
          "--stack-gap": "calc(max(0px, var(--rest-top)) + var(--quiet))",
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

      {/* On desktop the slots dissolve (display: contents), so every video
          is sticky against the whole column: once pinned it stays, and
          later ones paint over it. The spacing sits above each video as a
          margin, never below, because a sticky box is released early by its
          own bottom margin. A spacer at the end lets the last demo rest
          before the column's end carries the whole stack away. */}
      <div className="flex flex-col gap-16 lg:gap-0">
        {projects.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="flex flex-col gap-2.5 lg:contents"
          >
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor={p.cursor}
              className={`block lg:sticky lg:top-[var(--rest-top)] ${
                i > 0 ? "lg:mt-[var(--stack-gap)]" : ""
              }`}
            >
              {/* --covered is written on the link by the scroll pass. */}
              <div className="relative motion-safe:[scale:calc(1_-_var(--covered,0)_*_0.05)]">
                <DemoVideo project={p} play={!pinned || i === active} />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[20px] bg-bg [opacity:calc(var(--covered,0)_*_0.5)]"
                />
              </div>
            </a>
            <Caption project={p} className="lg:hidden" />
          </div>
        ))}
        <div aria-hidden="true" className="hidden lg:block lg:h-[var(--quiet)]" />
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
            data-cursor={p.cursor}
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

/* Name and blurb under a demo: the stack's plain column below lg, and every tile
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

/* Two-way switch: the scrolling stack or the static grid, with the keycap
   of the shortcut that flips between them. Hidden below sm, where both
   views are the same single stacked column. */
function ViewToggle({
  view,
  onChange,
  keyHeld,
  className = "",
}: {
  view: View;
  onChange: (view: View) => void;
  keyHeld: boolean;
  className?: string;
}) {
  const options = [
    { value: "stack", label: "scrolling view", Icon: Layers },
    { value: "grid", label: "grid view", Icon: Grid2x2 },
  ] as const;

  return (
    <div
      role="group"
      aria-label="projects layout"
      aria-keyshortcuts={SHORTCUT}
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
      {/* Only where there is likely a keyboard to press it on. */}
      <span
        aria-hidden="true"
        className="ml-1.5 hidden items-center gap-1.5 select-none pointer-fine:inline-flex"
      >
        <kbd
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border px-1 font-sans text-[0.6875rem] leading-none transition-[scale,background-color,border-color,color] duration-150 ease-[var(--ease-out)] ${
            keyHeld
              ? "scale-[0.92] border-transparent bg-pill text-accent"
              : "border-rule text-text-dim"
          }`}
        >
          {SHORTCUT.toUpperCase()}
        </kbd>
        <span className="text-[0.75rem] leading-none tracking-[0.04em] whitespace-nowrap text-text-dim">
          switch view
        </span>
      </span>
    </div>
  );
}

/* Plays only while on screen so the looping videos don't compete for
   decode time, and stays on its poster when the visitor prefers reduced
   motion. `play` holds it paused even on screen: the stack uses it for
   every demo but the one on top, since the observer still counts a
   covered demo as visible. */
function DemoVideo({
  project,
  play = true,
}: {
  project: SplitProject;
  play?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (onScreen && play) video.play().catch(() => {});
    else video.pause();
  }, [onScreen, play]);

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
