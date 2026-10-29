"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/* Small fixed switch, top right. The inline script in layout.tsx has
   already set data-theme before hydration; this reads it, toggles it, and
   remembers the choice. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    setTheme(t === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    /* see globals.css: suspends per-element colour fades for the switch */
    root.setAttribute("data-theme-switching", "");
    window.setTimeout(() => root.removeAttribute("data-theme-switching"), 340);
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
      title={dark ? "light mode" : "dark mode"}
      className="fixed top-5 right-5 z-40 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-dim transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-visible:outline-none sm:top-6 sm:right-6"
    >
      {/* Render nothing until the theme is known so the icon never flips
          on hydration. */}
      {theme &&
        (dark ? (
          <Sun size={16} strokeWidth={1.75} />
        ) : (
          <Moon size={16} strokeWidth={1.75} />
        ))}
    </button>
  );
}
