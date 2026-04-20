"use client";

import { useState, useRef, useEffect } from "react";
import Tooltip from "./Tooltip";

interface Entry {
  name: string;
  desc: string;
  year: string;
  months?: string;
}

export default function WorkRow({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 120);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const hoverable = Boolean(entry.months);

  return (
    <div
      className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-7 border-b border-rule first:border-t cursor-default group"
      onMouseEnter={hoverable ? show : undefined}
      onMouseLeave={hoverable ? hide : undefined}
    >
      <div>
        <div className="text-[1.2rem] font-normal text-text tracking-[0.01em] transition-colors duration-200 group-hover:text-accent">
          {entry.name}
        </div>
        <div className="mt-1.5 text-[0.875rem] text-text-mid tracking-[0.04em]">
          {entry.desc}
        </div>
      </div>
      <div className="text-[0.875rem] tracking-[0.1em] text-text-dim whitespace-nowrap">
        {hoverable ? (
          <Tooltip content={entry.months} align="right" open={open}>
            {entry.year}
          </Tooltip>
        ) : (
          entry.year
        )}
      </div>
    </div>
  );
}
