import { getChess } from "@/lib/chess";

/* One small line in the header: the live rapid rating from chess.com with
   a tiny sparkline of recent games. Server rendered, cached for an hour,
   and renders nothing if the API is unreachable. */
export default async function ChessLine() {
  const c = await getChess(60);
  if (!c) return null;

  const s = c.series;
  const W = 64,
    H = 14,
    PAD = 1.5;
  const lo = Math.min(...s),
    hi = Math.max(...s);
  const x = (i: number) =>
    PAD + (i / Math.max(1, s.length - 1)) * (W - PAD * 2);
  const y = (v: number) =>
    H - PAD - ((v - lo) / Math.max(1, hi - lo)) * (H - PAD * 2);
  const d = s
    .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");

  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-3 inline-flex items-center gap-2.5 self-start text-[0.8125rem] tracking-[0.12em] text-text-dim no-underline transition-colors duration-200 hover:text-accent"
      aria-label={`chess.com rapid rating ${c.rating}, peak ${c.best}`}
    >
      <span aria-hidden="true" className="text-[0.9em]">
        ♞
      </span>
      <span>
        <span className="text-text tabular-nums transition-colors duration-200 group-hover:text-accent">
          {c.rating}
        </span>{" "}
        rapid
      </span>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden="true"
        className="text-accent opacity-80"
      >
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          cx={x(s.length - 1)}
          cy={y(s.at(-1)!)}
          r={1.6}
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
