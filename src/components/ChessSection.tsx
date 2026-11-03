import { getChess } from "@/lib/chess";

/* Live rapid rating from chess.com with a sparkline of the recent games.
   Server rendered and cached for an hour; renders nothing if the API is
   unreachable so the page never shows a broken block. */
export default async function ChessSection() {
  const c = await getChess();
  if (!c) return null;

  const games = c.wins + c.losses + c.draws;
  const winRate = Math.round((c.wins / Math.max(1, games)) * 100);
  const ago = daysAgo(c.lastPlayed);

  /* sparkline geometry */
  const W = 640,
    H = 64,
    PAD = 4;
  const s = c.series;
  const lo = Math.min(...s),
    hi = Math.max(...s);
  const x = (i: number) =>
    PAD + (i / Math.max(1, s.length - 1)) * (W - PAD * 2);
  const y = (v: number) =>
    H - PAD - ((v - lo) / Math.max(1, hi - lo)) * (H - PAD * 2);
  const line = s
    .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(s.length - 1).toFixed(1)} ${H} L${x(0).toFixed(1)} ${H} Z`;
  const peakIdx = s.indexOf(hi);

  return (
    <section id="chess" className="scroll-mt-18 border-t border-rule pt-14">
      <p className="text-[1.4rem] font-light text-accent-deep mb-10">chess</p>

      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-x-6">
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-baseline gap-3 no-underline"
        >
          <span className="text-[2.6rem] font-light leading-none tracking-[-0.01em] text-text transition-colors duration-200 group-hover:text-accent tabular-nums">
            {c.rating}
          </span>
          <span className="text-[0.875rem] tracking-[0.14em] text-text-dim">
            rapid
          </span>
        </a>
        <p className="text-[0.875rem] tracking-[0.04em] text-text-dim sm:text-right">
          peak {c.best} · {games.toLocaleString()} games · {winRate}% wins
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-6 h-16 w-full text-accent"
        role="img"
        aria-label={`rapid rating over the last ${s.length} games, from ${lo} to ${hi}`}
      >
        <path d={area} fill="currentColor" opacity={0.08} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        <circle
          cx={x(peakIdx)}
          cy={y(hi)}
          r={2.5}
          fill="currentColor"
          opacity={0.6}
        />
        <circle
          cx={x(s.length - 1)}
          cy={y(s.at(-1)!)}
          r={3}
          fill="currentColor"
        />
      </svg>

      <div className="mt-2 flex justify-between text-[0.75rem] tracking-[0.1em] text-text-dim">
        <span>last {s.length} games</span>
        <span>{ago}</span>
      </div>
    </section>
  );
}

function daysAgo(unix: number) {
  if (!unix) return "";
  const d = Math.floor((Date.now() / 1000 - unix) / 86400);
  if (d <= 0) return "played today";
  if (d === 1) return "played yesterday";
  if (d < 30) return `played ${d} days ago`;
  return `played ${Math.floor(d / 30)} months ago`;
}
