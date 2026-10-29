"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDiaSettings, type DiaSettings } from "./diaSettings";

const VIEWBOX_WIDTH = 1440;
const VIEWBOX_HEIGHT = 720;

/* Stop colours live in CSS variables (globals.css) so the gradient follows
   the theme without re-rendering; only the offsets come from settings. */
function stopOffsets(s: DiaSettings) {
  return [0, ...s.stops, 100];
}

function getBarHeights(s: DiaSettings) {
  const middle = (s.count - 1) / 2;
  return Array.from({ length: s.count }, (_, index) => {
    const distance = middle === 0 ? 0 : Math.abs(index - middle) / middle;
    const curve = 1 - Math.pow(distance, s.curve);
    return VIEWBOX_HEIGHT * (s.valley + (s.peak - s.valley) * curve);
  });
}

export default function DiaGradient() {
  const s = useDiaSettings();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = useState(0);
  const id = useId().replaceAll(":", "");
  const gradientId = `dia-gradient-${id}`;
  const blurId = `dia-blur-${id}`;
  const heights = getBarHeights(s);
  const barWidth = VIEWBOX_WIDTH / s.count;
  const offsets = stopOffsets(s);
  const cssStops = offsets.map((o, i) => `var(--dia-${i}) ${o}%`).join(", ");

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

  /* Dark bars: side feather beyond the cell on both sides, so the mask's
     solid span is the cell itself. */
  const feather = barWidth * s.darkFeather;
  const featherPct = (feather / (barWidth + feather * 2)) * 100;
  const sideMask = `linear-gradient(to right, transparent 0%, #000 ${featherPct}%, #000 ${100 - featherPct}%, transparent 100%)`;
  const topMask = `linear-gradient(to bottom, transparent 0%, #000 ${s.darkTop}%)`;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[52svh] min-h-[360px] max-h-[580px] overflow-hidden sm:h-[60svh] sm:min-h-[480px] sm:max-h-[680px]"
    >
      <div
        className="h-full w-full origin-bottom motion-reduce:transition-none"
        style={{ transform: `scaleY(${scaleY})` }}
      >
        {/* Dark mode: the same bars as plain gradient divs with mask
            feathering and no blur filter. A filter is rasterized and
            quantized without dithering, which on a dark page shows as blocky
            edges and contour lines; gradients and gradient masks are
            evaluated per pixel and dithered. Each bar feathers both sides
            beyond its own cell, and z-order peaks at the centre bar, so every
            feather lands on a neighbour's solid core: seams crossfade
            symmetrically with no alpha dip. */}
        <div className="absolute inset-0 hidden dark:block" aria-hidden="true">
          {heights.map((height, index) => (
            <div
              key={index}
              className="dia-bar absolute"
              style={{
                left: `${((index * barWidth - feather) / VIEWBOX_WIDTH) * 100}%`,
                width: `${((barWidth + feather * 2) / VIEWBOX_WIDTH) * 100}%`,
                top: `${((VIEWBOX_HEIGHT - height) / VIEWBOX_HEIGHT) * 100}%`,
                height: `${((height + s.overhang) / VIEWBOX_HEIGHT) * 100}%`,
                zIndex: s.count - Math.abs(index - (s.count - 1) / 2),
                backgroundImage: `linear-gradient(to top, ${cssStops})`,
                WebkitMaskImage: `${sideMask}, ${topMask}`,
                maskImage: `${sideMask}, ${topMask}`,
              }}
            />
          ))}
        </div>
        <svg
          className="h-full w-full dark:hidden"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0.5" y1="1" x2="0.5" y2="0">
              {offsets.map((o, i) => (
                <stop
                  key={i}
                  offset={`${o}%`}
                  style={{ stopColor: `var(--dia-${i})` }}
                />
              ))}
            </linearGradient>
            <filter id={blurId} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation={s.lightBlur} />
            </filter>
          </defs>

          {/* Light bars are a little wider than their cell and centred on it,
              then blurred as a group. */}
          <g filter={`url(#${blurId})`}>
            {heights.map((height, index) => (
              <rect
                key={index}
                x={index * barWidth - (barWidth * (s.lightWidth - 1)) / 2}
                y={VIEWBOX_HEIGHT - height}
                width={barWidth * s.lightWidth}
                height={height + s.overhang}
                fill={`url(#${gradientId})`}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
