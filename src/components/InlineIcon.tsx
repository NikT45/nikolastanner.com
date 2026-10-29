"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/* Wraps a word and its brand mark as one continuous pill. inline-flex with
   centred items keeps the icon on the text's vertical midpoint regardless of
   platform baseline quirks (iOS Safari sat the card fan noticeably low when it
   was baseline-aligned). The tight line-height keeps the pill shorter than the
   paragraph's 1.75 line box so it never pushes lines apart. */
export function IconPill({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  /* Optical alignment: when a pill happens to start a line, hang its left
     padding into the margin so the word, not the capsule, lines up with
     the column. Re-measured on resize and once fonts have loaded, since
     both can change where lines break. */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const block = el.closest("p") ?? el.parentElement;
    if (!block) return;
    const measure = () => {
      el.style.marginLeft = "0px";
      const pad = parseFloat(getComputedStyle(el).paddingLeft);
      const atStart = Math.abs(el.getBoundingClientRect().left - block.getBoundingClientRect().left) < 1;
      el.style.marginLeft = atStart ? `-${pad}px` : "0px";
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(block);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-[0.3em] whitespace-nowrap rounded-full bg-pill pl-[0.56em] pr-[0.52em] pt-[0.04em] pb-[0.12em] leading-[1.3] align-baseline"
    >
      {children}
    </span>
  );
}

/* Inline brand marks; spacing from the word comes from the pill's gap. */
const wrap = "inline-block shrink-0 leading-none";

export function GoogleIcon() {
  return (
    <span className={wrap}>
      <img
        src="/Google_Favicon_2025.svg.webp"
        alt=""
        aria-hidden="true"
        width={250}
        height={256}
        className="block h-[0.85em] w-auto"
      />
    </span>
  );
}

/* Rendered as a small app-icon tile: white rounded square with the four
   shapes inside (the PNG itself is trimmed and transparent). */
export function EdgeGalleryIcon() {
  return (
    <span className={wrap}>
      <span className="block h-[1em] w-[1em] rounded-[0.26em] bg-white p-[0.15em] ring-1 ring-rule">
        <img
          src="/galleryIcon.png"
          alt=""
          aria-hidden="true"
          width={299}
          height={298}
          className="block h-full w-full object-contain"
        />
      </span>
    </span>
  );
}

/* YouTube play button: red rounded rect with a white triangle. */
export function YouTubeIcon() {
  return (
    <span className={wrap}>
      <svg
        viewBox="0 0 24 17"
        width="24"
        height="17"
        aria-hidden="true"
        className="block h-[0.72em] w-auto"
      >
        <path
          d="M23.5 2.7a3 3 0 0 0-2.1-2.1C19.5 0 12 0 12 0S4.5 0 2.6.6A3 3 0 0 0 .5 2.7C0 4.6 0 8.5 0 8.5s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8Z"
          fill="#ff0033"
        />
        <path d="M9.6 12.1 15.8 8.5 9.6 4.9v7.2Z" fill="#fff" />
      </svg>
    </span>
  );
}
