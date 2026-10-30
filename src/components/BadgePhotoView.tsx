"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* A quad in viewport pixels: tl, tr, br, bl. */
export type Quad = [number, number][];

/* Where the badge sits in badge-stuck.webp, as fractions of the photo, split
   at the crease. The lower half bends toward the camera, so the two halves
   are different planes. Clicked by hand on the photo. */
const PHOTO_TOP: Quad = [
  [0.0578, 0.3144],
  [0.5056, 0.3178],
  [0.5378, 0.5233],
  [0.1156, 0.5156],
];
const PHOTO_BOTTOM: Quad = [
  [0.1156, 0.5156],
  [0.5378, 0.5233],
  [0.6111, 0.6589],
  [0.2233, 0.6389],
];
/* The scan has transparent padding; this is where the paper actually is,
   as fractions of the image, plus the crease row. Measured from alpha. */
const PAPER = { l: 0.0469, r: 0.9561, t: 0.0562, b: 0.9591 };
export const CREASE = 0.484;
const BADGE_ASPECT = 1226 / 1283;

/* Homography that maps `from` (a quad in the element's own px) onto `to`
   (a quad in viewport px), as a CSS matrix3d. */
function matrix3d(from: Quad, to: Quad) {
  // adjugate method (Heckbert)
  // Heckbert square-to-quad, as a row-major 3x3 acting on column vectors:
  // [x', y', w'] = H · [u, v, 1]
  const sq = (p: number[][]) => {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = p;
    const px = x0 - x1 + x2 - x3,
      py = y0 - y1 + y2 - y3;
    if (px === 0 && py === 0)
      return [x1 - x0, x3 - x0, x0, y1 - y0, y3 - y0, y0, 0, 0, 1];
    const dx1 = x1 - x2,
      dx2 = x3 - x2,
      dy1 = y1 - y2,
      dy2 = y3 - y2;
    const det = dx1 * dy2 - dx2 * dy1;
    const g = (px * dy2 - dx2 * py) / det,
      h = (dx1 * py - px * dy1) / det;
    return [
      x1 - x0 + g * x1,
      x3 - x0 + h * x3,
      x0,
      y1 - y0 + g * y1,
      y3 - y0 + h * y3,
      y0,
      g,
      h,
      1,
    ];
  };
  const adj = (m: number[]) => [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
  const mul = (a: number[], b: number[]) => {
    const r = new Array(9).fill(0);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++) r[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
    return r;
  };
  const src = sq(from);
  const dst = sq(to);
  const H = mul(dst, adj(src));
  // 3x3 homography → 4x4 column-major matrix3d, z row/col identity
  return `matrix3d(${H[0]},${H[3]},0,${H[6]},${H[1]},${H[4]},0,${H[7]},0,0,1,0,${H[2]},${H[5]},0,${H[8]})`;
}

/* the paper's quad inside a full-element quad, by bilinear interpolation */
function paperQuad(q: Quad): Quad {
  const [tl, tr, br, bl] = q;
  const at = (u: number, v: number): [number, number] => {
    const top = [tl[0] + (tr[0] - tl[0]) * u, tl[1] + (tr[1] - tl[1]) * u];
    const bot = [bl[0] + (br[0] - bl[0]) * u, bl[1] + (br[1] - bl[1]) * u];
    return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
  };
  return [
    at(PAPER.l, PAPER.t),
    at(PAPER.r, PAPER.t),
    at(PAPER.r, PAPER.b),
    at(PAPER.l, PAPER.b),
  ];
}

const lerpQ = (a: Quad, b: Quad, t: number): Quad =>
  a.map(([x, y], i) => [x + (b[i][0] - x) * t, y + (b[i][1] - y) * t]) as Quad;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/* split a quad along a horizontal fraction into top and bottom quads */
function splitQuad(q: Quad, f: number): [Quad, Quad] {
  const [tl, tr, br, bl] = q;
  const ml: [number, number] = [
    tl[0] + (bl[0] - tl[0]) * f,
    tl[1] + (bl[1] - tl[1]) * f,
  ];
  const mr: [number, number] = [
    tr[0] + (br[0] - tr[0]) * f,
    tr[1] + (br[1] - tr[1]) * f,
  ];
  return [
    [tl, tr, mr, ml],
    [ml, mr, br, bl],
  ];
}

/* Tap-to-reveal: a 2D copy of the badge lifts off the canvas at the exact
   quad the 3D badge was drawn at, flies to the centre, then the monitor
   photo fades in behind it and the copy warps into the badge's place in the
   photo, folded at the crease, and crossfades away. Click or Escape runs
   it in reverse. `start` is the badge's projected quad in viewport px. */
export default function BadgePhotoView({
  start,
  onClose,
}: {
  start: Quad;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const blank = useRef<HTMLImageElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const closing = useRef(false);
  const cancel = useRef<() => void>(() => {});
  /* portal target: the badge host has a transform, which would trap a
     fixed overlay inside it, so render at the body instead */
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    if (!host || !root.current) return;
    const vw = window.innerWidth,
      vh = window.innerHeight;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // the half elements are sized to a comfortable rect; the matrix maps from that box
    const cw = Math.min(520, vw * 0.7),
      ch = cw * BADGE_ASPECT;
    const cx = (vw - cw) / 2,
      cy = (vh - ch) / 2;
    // photo rect (square), and the badge quads inside it
    const S = Math.min(vw * 0.92, vh * 0.92, 900);
    const px = (vw - S) / 2,
      py = (vh - S) / 2;
    const inPhoto = (q: Quad): Quad =>
      q.map(([x, y]) => [px + x * S, py + y * S]) as Quad;
    const photoTop = inPhoto(PHOTO_TOP),
      photoBottom = inPhoto(PHOTO_BOTTOM);
    const [startTop, startBottom] = splitQuad(
      paperQuad(start),
      (CREASE - PAPER.t) / (PAPER.b - PAPER.t),
    );
    const el = {
      root: root.current!,
      photo: photo.current!,
      blank: blank.current!,
      top: top.current!,
      bottom: bottom.current!,
      shade: shade.current!,
      caption: caption.current!,
    };
    el.photo.style.left = `${px}px`;
    el.photo.style.top = `${py}px`;
    el.photo.style.width = `${S}px`;
    el.photo.style.height = `${S}px`;
    el.blank.style.left = `${px}px`;
    el.blank.style.top = `${py}px`;
    el.blank.style.width = `${S}px`;
    el.blank.style.height = `${S}px`;
    el.caption.style.top = `${py + S + 18}px`;
    // half elements are sized to the centre rect; the matrix maps from that box
    const hw = cw,
      hTop = ch * CREASE,
      hBot = ch * (1 - CREASE);
    el.top.style.width = `${hw}px`;
    el.top.style.height = `${hTop}px`;
    el.bottom.style.width = `${hw}px`;
    el.bottom.style.height = `${hBot}px`;
    (el.top.firstElementChild as HTMLElement).style.height = `${ch}px`;
    (el.bottom.firstElementChild as HTMLElement).style.height = `${ch}px`;
    (el.bottom.firstElementChild as HTMLElement).style.top = `${-hTop}px`;

    const srcTop: Quad = [
      [PAPER.l * hw, PAPER.t * ch],
      [PAPER.r * hw, PAPER.t * ch],
      [PAPER.r * hw, CREASE * ch],
      [PAPER.l * hw, CREASE * ch],
    ];
    const srcBot: Quad = [
      [PAPER.l * hw, 0],
      [PAPER.r * hw, 0],
      [PAPER.r * hw, (PAPER.b - CREASE) * ch],
      [PAPER.l * hw, (PAPER.b - CREASE) * ch],
    ];
    const set = (qt: Quad, qb: Quad) => {
      el.top.style.transform = matrix3d(srcTop, qt);
      el.bottom.style.transform = matrix3d(srcBot, qb);
    };
    const stage = (ms: number, step: (t: number) => void) =>
      new Promise<void>((res) => {
        if (closing.current && ms > 0) ms = ms * 0.8;
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / ms);
          step(easeInOut(t));
          if (t < 1) raf = requestAnimationFrame(tick);
          else res();
        };
        raf = requestAnimationFrame(tick);
        cancel.current = () => {
          cancelAnimationFrame(raf);
          res();
        };
      });

    let stopped = false;
    const run = async () => {
      set(startTop, startBottom);
      el.root.style.opacity = "1";
      if (reduced) {
        set(photoTop, photoBottom);
        el.blank.style.opacity = "1";
        el.photo.style.opacity = "1";
        el.caption.style.opacity = "1";
        el.top.style.opacity = el.bottom.style.opacity = "0";
        return;
      }
      // one motion: the copy peels off the badge and settles into its place
      // in the photo, folding as it goes; the photo comes up underneath
      // during the second half so the copy lands on itself
      await stage(1100, (t) => {
        set(lerpQ(startTop, photoTop, t), lerpQ(startBottom, photoBottom, t));
        el.root.style.setProperty(
          "--backdrop",
          String(0.86 * Math.min(1, t * 1.6)),
        );
        const p = Math.max(0, (t - 0.35) / 0.65);
        el.blank.style.opacity = String(p);
        el.shade.style.opacity = String(0.35 * p);
      });
      if (stopped) return;
      // landing: the real photo comes up as the copy fades, so the copy
      // becomes the badge in the picture
      await stage(520, (t) => {
        el.photo.style.opacity = String(t);
        el.caption.style.opacity = String(t);
        el.top.style.opacity = el.bottom.style.opacity = String(1 - t);
        el.shade.style.opacity = String(0.35 * (1 - t));
      });
    };
    run();

    const close = async () => {
      if (closing.current) return;
      closing.current = true;
      stopped = true;
      cancel.current();
      if (reduced) {
        el.root.style.opacity = "0";
        setTimeout(onClose, 200);
        return;
      }
      set(photoTop, photoBottom);
      await stage(360, (t) => {
        el.top.style.opacity = el.bottom.style.opacity = String(t);
        el.photo.style.opacity = String(1 - t);
        el.caption.style.opacity = String(1 - t);
        el.shade.style.opacity = String(0.35 * t);
      });
      await stage(1000, (t) => {
        set(lerpQ(photoTop, startTop, t), lerpQ(photoBottom, startBottom, t));
        const p = Math.max(0, 1 - t / 0.65);
        el.blank.style.opacity = String(p);
        el.shade.style.opacity = String(0.35 * p);
        el.root.style.setProperty(
          "--backdrop",
          String(0.86 * Math.max(0, 1 - (t - 0.4) / 0.6)),
        );
      });
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    el.root.addEventListener("click", close);
    window.addEventListener("keydown", onKey);
    return () => {
      stopped = true;
      cancel.current();
      el.root.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [start, onClose, host]);

  if (!host) return null;
  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-label="the badge on my monitor"
      className="fixed inset-0 z-[60] cursor-zoom-out opacity-0 [perspective:1200px]"
      style={{
        background: "rgba(8, 12, 16, var(--backdrop, 0))",
        transition: "opacity 120ms",
      }}
    >
      <img
        ref={blank}
        src="/badge-stuck-blank.webp"
        alt=""
        aria-hidden="true"
        className="absolute rounded-2xl object-cover opacity-0 shadow-2xl"
      />
      <img
        ref={photo}
        src="/badge-stuck.webp"
        alt="the guest badge taped to the bottom bezel of my monitor"
        className="absolute rounded-2xl object-cover opacity-0 shadow-2xl"
      />
      <p
        ref={caption}
        className="pointer-events-none absolute inset-x-0 text-center text-[0.8125rem] tracking-[0.08em] text-[#d6cec7] opacity-0"
      >
        the badge i had stuck to my monitor for two years
      </p>
      <div
        ref={top}
        className="absolute left-0 top-0 origin-top-left overflow-hidden will-change-transform"
      >
        <img
          src="/guest-badge.webp"
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-0 w-full"
        />
      </div>
      <div
        ref={bottom}
        className="absolute left-0 top-0 origin-top-left overflow-hidden will-change-transform"
      >
        <img
          src="/guest-badge.webp"
          alt=""
          aria-hidden="true"
          className="absolute left-0 w-full"
        />
        {/* fold shading on the bent half */}
        <div
          ref={shade}
          className="pointer-events-none absolute inset-0 opacity-0 [background:linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0)_45%)]"
        />
      </div>
    </div>,
    host,
  );
}
