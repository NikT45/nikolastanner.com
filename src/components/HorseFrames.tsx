"use client";

import { useEffect, useState } from "react";

export default function HorseFrames({
  frames,
  className,
}: {
  frames: string[];
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % frames.length), 1000 / 15);
    return () => clearInterval(id);
  }, [frames.length]);

  return (
    <pre
      aria-hidden="true"
      className={`font-mono text-[0.55rem] leading-[1.05] text-text-dim whitespace-pre select-none ${className ?? ""}`}
    >
      {frames[i]}
    </pre>
  );
}
