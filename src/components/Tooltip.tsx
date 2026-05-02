"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

export default function Tooltip({
  content,
  children,
  delay = 120,
  align = "left",
  open: openProp,
  bgImage,
}: {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  align?: "left" | "right";
  open?: boolean;
  bgImage?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (isControlled) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setInternalOpen(true), delay);
  };
  const hide = () => {
    if (isControlled) return;
    if (timer.current) clearTimeout(timer.current);
    setInternalOpen(false);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const bubbleAlign = align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left";
  const arrowAlign = align === "right" ? "right-3" : "left-3";

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span
        className="underline decoration-accent-deep underline-offset-[3px] outline-none transition-colors duration-200 focus-visible:text-accent-deep"
        tabIndex={0}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      <span
        role="tooltip"
        aria-hidden={!open}
        className={`pointer-events-none absolute ${bubbleAlign} top-[calc(100%+12px)] z-20 w-[260px] transition-all duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-1 scale-[0.97]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute ${arrowAlign} -top-[5px] w-2.5 h-2.5 bg-bg border-l border-t border-rule rotate-45 rounded-[2px]`}
        />
        <span className="relative block overflow-hidden bg-bg border border-rule rounded-lg shadow-[0_10px_30px_-8px_rgba(26,15,30,0.2),0_2px_6px_-2px_rgba(26,15,30,0.08)] px-4 py-3 text-[0.875rem] leading-[1.7] text-text-mid tracking-[0.02em]">
          {bgImage && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[length:150%] bg-[45%_35%] opacity-20"
              style={{ backgroundImage: `url('${bgImage}')` }}
            />
          )}
          <span className="relative block">{content}</span>
        </span>
      </span>
    </span>
  );
}
