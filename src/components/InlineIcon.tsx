import type { ReactNode } from "react";

/* Wraps a word and its brand mark as one unbreakable unit. inline-flex with
   centred items keeps the icon on the text's vertical midpoint regardless of
   platform baseline quirks (iOS Safari sat the card fan noticeably low when it
   was baseline-aligned). The tight line-height keeps the unit shorter than the
   paragraph's 1.75 line box so it never pushes lines apart. The pill fill is
   off for now; add `rounded-full bg-[#eae3df] px-[0.55em] py-[0.08em]` to
   bring it back. */
export function IconPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[0.3em] whitespace-nowrap leading-[1.3] align-baseline">
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
        className="block h-[0.9em] w-auto"
      />
    </span>
  );
}

/* Rendered as a small app-icon tile: white rounded square with the four
   shapes inside (the PNG itself is trimmed and transparent). */
export function EdgeGalleryIcon() {
  return (
    <span className={wrap}>
      <span className="block h-[0.9em] w-[0.9em] rounded-[0.24em] bg-white p-[0.13em] ring-1 ring-rule">
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
