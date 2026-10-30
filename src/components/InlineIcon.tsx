import type { ReactNode } from "react";

/* Wraps a word and its brand mark as one continuous pill. inline-flex with
   centred items keeps the icon on the text's vertical midpoint regardless of
   platform baseline quirks (iOS Safari sat the card fan noticeably low when it
   was baseline-aligned). The tight line-height keeps the pill shorter than the
   paragraph's 1.75 line box so it never pushes lines apart. */
export function IconPill({ children }: { children: ReactNode }) {
  return (
    /* The left padding is a real space character inside the pill, widened
       with word-spacing. Browsers drop a space at the start of a line, so a
       pill that wraps to a new line starts flush with the column, with no
       measurement and no flicker; mid-line the space reads as padding. The
       outer span is plain inline so that space is a break opportunity; the
       inner span keeps word and icon together. Callers must not put their
       own space before the pill, or the two would collapse into one. */
    <span className="rounded-full bg-pill pt-[0.04em] pr-[0.52em] pb-[0.12em] [word-spacing:0.31em] [box-decoration-break:slice]">
      {" "}
      <span className="inline-flex items-center gap-[0.3em] align-baseline leading-[1.3] whitespace-nowrap [word-spacing:0]">
        {children}
      </span>
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
