/* Inline brand marks that sit in running text, resting on the baseline. */
const wrap = "inline-block ml-[4px] leading-none";

export function GoogleIcon() {
  return (
    <span className={`${wrap} align-[-0.13em]`}>
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
    <span className={`${wrap} align-[-0.06em] ml-[5px]`}>
      <span className="block h-[19px] w-[19px] rounded-[5px] bg-white p-[3px] ring-1 ring-rule">
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
