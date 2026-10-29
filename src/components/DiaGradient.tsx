"use client";

import { useEffect, useRef, useState } from "react";

/* Reference box the band geometry is authored in (the Figma frame). */
const BOX_W = 1440;
const BOX_H = 540;
/* Headroom above the box so the top band's fade completes before the
   wrapper's overflow clip; the wrapper is sized (BOX_H + HEADROOM) / BOX_H
   taller than the band area to match. */
const HEADROOM = 160;
const FULL_H = BOX_H + HEADROOM;

/* Bands, bottom (index 0, drawn in front) to top (index 5, drawn behind).
   Colour i is var(--dia-i), so light and dark each use their own stops.
   Geometry is "dark · B · wide stack v2d": width, height, centre y. */
const BANDS = [
  { w: 1960, h: 300, cy: 510 },
  { w: 1808, h: 284, cy: 442 },
  { w: 1656, h: 268, cy: 374 },
  { w: 1732, h: 252, cy: 318 },
  { w: 1656, h: 236, cy: 260 },
  { w: 1200, h: 220, cy: 170 },
];

/* Each band is a radial gradient rather than a blurred ellipse: gradients
   are evaluated per pixel and dithered, where a blur filter is rasterized
   and quantized and shows contour lines on a dark page. The box is padded
   so the fade is centred on the Figma ellipse's edge, like a blur, and
   the stop profile is eased with 50% at the edge. */
/* Eased falloff from the solid core to transparent, so the fade reads like
   a Gaussian blur rather than a straight ramp: slow out of the core, fast
   through the middle, slow into transparent. */
function fade(i: number, solid: number) {
  const c = `var(--dia-${i})`;
  const mix = (pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;
  const f = 100 - solid * 100;
  const at = (k: number) => `${(solid * 100 + f * k).toFixed(2)}%`;
  return `radial-gradient(ellipse 50% 50% at 50% 50%, ${c} 0%, ${c} ${at(0)}, ${mix(88)} ${at(0.2)}, ${mix(60)} ${at(0.45)}, ${mix(28)} ${at(0.7)}, ${mix(8)} ${at(0.88)}, transparent 100%)`;
}

/* Tuning: vertical step scale, lift, size scales and the fade distance
   (acts like a blur radius), all in box units. */
const s = { stepScale: 1, lift: 0, widthScale: 1, heightScale: 1, blur: 140 };

export default function DiaGradient() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScaleY(1);
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const revealDistance = Math.min(rect.height, viewportHeight * 0.7);
      const progress = (viewportHeight - rect.top) / revealDistance;
      setScaleY(Math.max(0, Math.min(1, progress)));
    };

    const queueMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", queueMeasure, { passive: true });
    window.addEventListener("resize", queueMeasure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueMeasure);
      window.removeEventListener("resize", queueMeasure);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[68svh] max-h-[752px] min-h-[467px] overflow-hidden sm:h-[78svh] sm:max-h-[881px] sm:min-h-[622px]"
    >
      <div
        className="relative h-full w-full origin-bottom motion-reduce:transition-none"
        style={{ transform: `scaleY(${scaleY})` }}
      >
        {BANDS.map((b, i) => {
          const w = b.w * s.widthScale;
          const h = b.h * s.heightScale;
          /* distance from the bottom edge, scaled, then lifted */
          const cy = BOX_H - (BOX_H - b.cy) * s.stepScale - s.lift;
          /* A blur centres its fade on the original edge, half inside and half
             outside, so the solid core is the ellipse shrunk by blur/2 and the
             box is the ellipse grown by blur/2. The horizontal pad is scaled so
             one stop fraction serves both axes. */
          const halfH = h / 2 + s.blur / 2;
          const solid = Math.max(0.05, (h / 2 - s.blur / 2) / halfH);
          const halfW = w / 2 / solid;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${((BOX_W / 2 - halfW) / BOX_W) * 100}%`,
                width: `${((halfW * 2) / BOX_W) * 100}%`,
                top: `${((cy - halfH + HEADROOM) / FULL_H) * 100}%`,
                height: `${((halfH * 2) / FULL_H) * 100}%`,
                zIndex: BANDS.length - i,
                backgroundImage: fade(i, solid),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
