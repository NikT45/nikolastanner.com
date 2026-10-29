"use client";

import dynamic from "next/dynamic";

/* Three.js only on the client, and only once the page shell has shipped. */
const HangingBadge = dynamic(() => import("./HangingBadge"), { ssr: false });

export default function HangingBadgeLoader({ className, scale }: { className?: string; scale?: number }) {
  return <HangingBadge className={className} scale={scale} />;
}
