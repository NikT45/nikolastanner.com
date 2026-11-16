"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

/* One per project card, drawn from the CURSORS frame in Figma:
   arrow (piptrips), tab key (nimbit), audio pill (crestnotes), glass touch
   (bond). */
export type CursorKind = "arrow" | "tab" | "audio" | "glass";

const KINDS: CursorKind[] = ["arrow", "tab", "audio", "glass"];

/* Where each cursor sits on the pointer and the point it sways about. The
   arrow keeps its tip on the pointer; the others are centred on it. The
   glass circle would show nothing if it turned about its own centre, so it
   swings from a point above itself instead. */
const PLACE: Record<CursorKind, { offset: string; origin: string }> = {
  arrow: { offset: "", origin: "0 0" },
  tab: { offset: "translate(-50%, -50%) ", origin: "50% 50%" },
  audio: { offset: "translate(-50%, -50%) ", origin: "50% 50%" },
  glass: { offset: "translate(-50%, -50%) ", origin: "50% -50%" },
};

/* The cursors are drawn at their Figma size and enlarged as a whole, so
   every measurement below still matches the design. */
const SIZE = 1.5;

/* The audio pill's bars: full height (px), then the length and head start
   (ms) of each one's loop. Unequal loops keep them from ever lining up. */
const BARS = [
  { height: 6, loop: 520, lead: 120 },
  { height: 12, loop: 420, lead: 300 },
  { height: 8, loop: 600, lead: 80 },
  { height: 14, loop: 460, lead: 240 },
  { height: 6, loop: 540, lead: 400 },
];

/* Sway: the cursor leans with horizontal speed and springs back upright.
   Degrees of lean per px/ms, capped so a flick never tips it far. */
const LEAN = 7;
const MAX_LEAN = 8;
/* Spring of 0.5s with 0.25 bounce, as stiffness and damping per second:
   one small overshoot on the way back, which is the sway. */
const STIFFNESS = 158;
const DAMPING = 18.85;
/* No movement for this long (ms) counts as stopped. */
const STILL = 48;

const kindAt = (el: Element | null): CursorKind | null => {
  const k = el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  return k && (KINDS as string[]).includes(k) ? (k as CursorKind) : null;
};

/* Replaces the pointer with a per-project cursor while a mouse is over any
   element carrying data-cursor. Rendered once; it finds the cards by
   delegation, so they only need the attribute. Touch never sees it. */
export default function ProjectCursor() {
  const [mounted, setMounted] = useState(false);
  const [kind, setKind] = useState<CursorKind | null>(null);
  /* The mouse button is down: the cursor shrinks as if it were pressing. */
  const [pressed, setPressed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tilts = useRef<Partial<Record<CursorKind, HTMLDivElement | null>>>({});

  useEffect(() => {
    setMounted(true);
    /* globals.css hides the native cursor over the cards only while this
       is set, so a card is never left with no cursor at all. */
    const html = document.documentElement;
    html.setAttribute("data-card-cursors", "");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current: CursorKind | null = null;
    /* Last mouse position, once one is known and inside the window. */
    let x = 0;
    let y = 0;
    let seen = false;
    let moved = 0;
    /* Horizontal speed in px/ms, smoothed so one jumpy event can't kick. */
    let speed = 0;
    let angle = 0;
    let spin = 0;
    let frame = 0;
    let last = 0;
    let scrollFrame = 0;

    const lean = () => {
      if (!current) return;
      const el = tilts.current[current];
      if (el) {
        el.style.transform = `${PLACE[current].offset}rotate(${angle.toFixed(2)}deg)`;
      }
    };

    const show = (next: CursorKind | null) => {
      if (next === current) return;
      current = next;
      lean();
      setKind(next);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (now - moved > STILL) speed = 0;
      const target = still.matches
        ? 0
        : Math.max(-MAX_LEAN, Math.min(MAX_LEAN, speed * LEAN));
      spin += (-STIFFNESS * (angle - target) - DAMPING * spin) * dt;
      angle += spin * dt;
      const resting =
        target === 0 && Math.abs(angle) < 0.01 && Math.abs(spin) < 0.01;
      if (resting) {
        angle = 0;
        spin = 0;
      }
      lean();
      frame = resting ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (seen && now > moved) {
        const v = (e.clientX - x) / (now - moved);
        speed += (v - speed) * 0.3;
      }
      x = e.clientX;
      y = e.clientY;
      seen = true;
      moved = now;
      if (root.current) {
        root.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      show(kindAt(e.target instanceof Element ? e.target : null));
      if (current && !frame) {
        last = now;
        frame = requestAnimationFrame(tick);
      }
    };

    /* Scrolling moves a different card under a pointer that hasn't moved,
       and the browser only reports that late, so look for ourselves. */
    const onScroll = () => {
      if (!seen || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (seen) show(kindAt(document.elementFromPoint(x, y)));
      });
    };

    const onLeave = () => {
      seen = false;
      speed = 0;
      setPressed(false);
      show(null);
    };

    /* Primary button only. A press that turns into dragging the link ends
       without a pointerup, so a cancel or a drag start releases it too. */
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) setPressed(true);
    };
    const onUp = () => setPressed(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("dragstart", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    html.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      html.removeAttribute("data-card-cursors");
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      document.removeEventListener("dragstart", onUp);
      window.removeEventListener("scroll", onScroll);
      html.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50"
    >
      {KINDS.map((k) => (
        /* The lean is written straight onto this wrapper each frame. */
        <div
          key={k}
          ref={(el) => {
            tilts.current[k] = el;
          }}
          className="absolute top-0 left-0"
          style={{
            zoom: SIZE,
            transform: `${PLACE[k].offset}rotate(0deg)`,
            transformOrigin: PLACE[k].origin,
          }}
        >
          <Visual kind={k} on={kind === k} pressed={pressed} />
        </div>
      ))}
    </div>,
    document.body,
  );
}

/* Each cursor fades and grows in on its own element rather than a shared
   wrapper: the glass one has a backdrop blur, and a fading parent would cut
   it off from the page behind it until the fade finished. */
function Visual({
  kind,
  on,
  pressed,
}: {
  kind: CursorKind;
  on: boolean;
  pressed: boolean;
}) {
  /* A transition, not a keyframe, so a quick click dips part of the way
     and turns straight back instead of playing a press out in full. */
  const state = `transition-[opacity,scale] duration-150 ease-[var(--ease-out)] motion-reduce:transition-[opacity] ${
    on
      ? `opacity-100 ${pressed ? "scale-[0.85]" : "scale-100"}`
      : "scale-90 opacity-0 motion-reduce:scale-100"
  }`;

  if (kind === "arrow") {
    return (
      <svg
        width="19"
        height="21"
        viewBox="0 0 19 21"
        fill="none"
        className={`block origin-top-left overflow-visible ${state}`}
      >
        <path
          d="M0 0L18.2 8.509C19.145 8.982 19.027 10.282 18.082 10.636L10.873 12.764L7.564 19.618C7.091 20.564 5.791 20.445 5.555 19.5L0 0Z"
          fill="#d63469"
          stroke="#fff"
          strokeWidth="1.89"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "tab") {
    return (
      <span
        className={`flex h-[22px] w-10 items-center justify-center rounded-[6px] border border-[#b9cbcf] bg-white/90 text-[11px] leading-none font-medium text-[#7e969c] shadow-[0_1.5px_0_rgb(30_49_57/0.18)] ${state}`}
      >
        tab
      </span>
    );
  }

  if (kind === "audio") {
    return (
      <span
        className={`flex h-[22px] w-[42px] items-center justify-center gap-[2px] rounded-full bg-[#2b6cb0] shadow-[0_0_0_1.5px_#fff,0_2px_6px_rgb(9_22_28/0.25)] ${state}`}
      >
        {/* Each bar breathes between a dot and its full height, and only
            while the pill is showing. Reduced motion leaves them still. */}
        {BARS.map((bar, i) => (
          <span
            key={i}
            className="w-[2px] animate-audio-bar rounded-[1px] bg-white motion-reduce:animate-none"
            style={{
              height: bar.height,
              animationDuration: `${bar.loop}ms`,
              animationDelay: `-${bar.lead}ms`,
              animationPlayState: on ? "running" : "paused",
            }}
          />
        ))}
      </span>
    );
  }

  return <span className={`block size-7 rounded-full ${state}`} style={GLASS} />;
}

/* Frosted touch point: a light fill that fades downward over a faint grey
   tint, the page blurred behind it, a bright rim with a top highlight, and
   a soft shadow with a hairline so it still reads on a pale screen. */
const GLASS: CSSProperties = {
  background:
    "linear-gradient(to bottom, rgb(255 255 255 / 0.5), rgb(255 255 255 / 0.16)), rgb(120 120 128 / 0.06)",
  backdropFilter: "blur(2.5px)",
  WebkitBackdropFilter: "blur(2.5px)",
  boxShadow: [
    "inset 0 0 0 1.25px rgb(255 255 255 / 0.7)",
    "inset 0 1px 1.5px rgb(255 255 255 / 0.8)",
    "0 0 1px 0.5px rgb(15 14 13 / 0.12)",
    "0 2px 8px rgb(15 14 13 / 0.2)",
  ].join(", "),
};
