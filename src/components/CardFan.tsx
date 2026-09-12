"use client";

import { useEffect, useState } from "react";
import styles from "./CardFan.module.css";

export interface FanCard {
  caption: string;
  /** Cycled in order while the fan is open. */
  images: string[];
}

const STEP_MS = 2000;

/* Hover opens the fan; click toggles it so it also works on touch. While
   open, a shared tick advances every card's photo; each card wraps the tick
   around its own image count, and the dots under the photo track it. */
export default function CardFan({
  cards,
  label = "see three cards",
}: {
  cards: [FanCard, FanCard, FanCard];
  label?: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tick, setTick] = useState(0);
  const open = pinned || hovered;

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setTick((t) => t + 1), STEP_MS);
    return () => clearInterval(id);
  }, [open]);

  return (
    <button
      type="button"
      className={`${styles.fan}${pinned ? ` ${styles.open}` : ""}`}
      aria-label={label}
      aria-expanded={open}
      onClick={() => setPinned((p) => !p)}
      onBlur={() => setPinned(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
    >
      {cards.map((card) => {
        const active = tick % card.images.length;
        return (
          <span key={card.caption} className={styles.pivot}>
            <span className={styles.card}>
              <span className={styles.img}>
                {card.images.map((src, i) => (
                  <span
                    key={src}
                    className={`${styles.slide}${i === active ? ` ${styles.slideActive}` : ""}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </span>
                ))}
              </span>
              <span className={styles.dots} aria-hidden="true">
                {card.images.map((src, i) => (
                  <span
                    key={src}
                    className={`${styles.dot}${i === active ? ` ${styles.dotActive}` : ""}`}
                  />
                ))}
              </span>
              <span className={styles.cap}>{card.caption}</span>
            </span>
          </span>
        );
      })}
    </button>
  );
}
