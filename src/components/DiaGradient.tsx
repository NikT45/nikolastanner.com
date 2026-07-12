"use client";

import { useEffect, useId, useRef, useState } from "react";

const VIEWBOX_WIDTH = 1440;
const VIEWBOX_HEIGHT = 720;
const BAR_COUNT = 11;
const VALLEY = 0.48;
const PEAK = 0.98;

const STOPS = [
  { offset: "0%", color: "#040F15" },
  { offset: "12.02%", color: "#040F15" },
  { offset: "24.52%", color: "#195C84" },
  { offset: "36.06%", color: "#4A91BC" },
  { offset: "48.08%", color: "#5FA8D3" },
  { offset: "66.35%", color: "#EDD3BF" },
  { offset: "100%", color: "#F8F4F1" },
] as const;

function getBarHeights() {
  const middle = (BAR_COUNT - 1) / 2;

  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const distance = Math.abs(index - middle) / middle;
    const curve = 1 - Math.pow(distance, 1.3);
    return VIEWBOX_HEIGHT * (VALLEY + (PEAK - VALLEY) * curve);
  });
}

export default function DiaGradient() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = useState(0);
  const id = useId().replaceAll(":", "");
  const gradientId = `dia-gradient-${id}`;
  const blurId = `dia-blur-${id}`;
  const heights = getBarHeights();
  const barWidth = VIEWBOX_WIDTH / BAR_COUNT;

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
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[52svh] min-h-[360px] max-h-[580px] overflow-hidden sm:h-[60svh] sm:min-h-[480px] sm:max-h-[680px]"
    >
      <div
        className="h-full w-full origin-bottom motion-reduce:transition-none"
        style={{ transform: `scaleY(${scaleY})` }}
      >
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0.5"
              y1="1"
              x2="0.5"
              y2="0"
            >
              {STOPS.map((stop) => (
                <stop
                  key={stop.offset}
                  offset={stop.offset}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>
            <filter id={blurId} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          <g filter={`url(#${blurId})`}>
            {heights.map((height, index) => (
              <rect
                key={index}
                x={index * barWidth - barWidth * 0.08}
                y={VIEWBOX_HEIGHT - height}
                width={barWidth * 1.22}
                height={height + 80}
                fill={`url(#${gradientId})`}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
