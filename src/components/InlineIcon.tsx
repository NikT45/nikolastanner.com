import type { ReactNode } from "react";

/* Wraps a word and its brand mark as one continuous pill. inline-flex with
   centred items keeps the icon on the text's vertical midpoint regardless of
   platform baseline quirks (iOS Safari sat the card fan noticeably low when it
   was baseline-aligned). The tight line-height keeps the pill shorter than the
   paragraph's 1.75 line box so it never pushes lines apart. */
export function IconPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[0.3em] whitespace-nowrap rounded-full bg-[#e2d8d2] px-[0.55em] py-[0.08em] leading-[1.3] align-baseline">
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
