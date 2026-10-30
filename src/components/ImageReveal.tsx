"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./ImageReveal.module.css";

/* Hover opens the card; click toggles it so it also works on touch and
   keyboard. While pinned, an outside tap or Escape closes it. With `href`
   the trigger is a link instead: hover still previews, click navigates. */
export default function ImageReveal({
  children,
  src,
  alt,
  caption,
  width,
  height,
  href,
}: {
  children: ReactNode;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  href?: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  /* On touch devices the preview never opens: a tap focuses the link,
     which would open the card under the finger and swallow the click. */
  const canHover = () => window.matchMedia("(hover: hover)").matches;
  const open = pinned || hovered;
  const root = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setPinned(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  return (
    <span
      ref={root}
      className={styles.root}
      data-open={open}
      /* Pointer events, not mouse events: mouse-enter handlers make iOS
         Safari treat the first tap as a hover, so a link would need two
         taps. Touch pointers are ignored, so a tap navigates at once. */
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch" && canHover()) setHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setHovered(false);
      }}
    >
      {href ? (
        <Link
          href={href}
          className={styles.trigger}
          onFocus={() => canHover() && setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          {children}
          <span className={styles.thumb} aria-hidden="true">
            <img src={src} alt="" width={width} height={height} />
          </span>
        </Link>
      ) : (
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setPinned((p) => !p)}
          onFocus={() => canHover() && setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          {children}
          <span className={styles.thumb} aria-hidden="true">
            <img src={src} alt="" width={width} height={height} />
          </span>
        </button>
      )}
      <span id={id} className={styles.card} aria-hidden={!open}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" />
        {caption && <span className={styles.caption}>{caption}</span>}
      </span>
    </span>
  );
}
