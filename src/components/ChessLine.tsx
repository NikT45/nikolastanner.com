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
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="-mt-px shrink-0"
      >
        {/* Hugeicons "chess 02" knight, free set, inlined so the site stays dependency-free */}
        <path d="M11.9261 10.9709C11.9259 11.7713 12.4389 13.0658 13.535 13.9709C15.1824 15.3312 16.0061 16.0114 16.1705 16.2625C16.3586 16.5499 16.3196 16.4655 16.4186 16.7981C16.5051 17.0888 16.5051 17.5053 16.5051 18.3384V18.418C16.5051 18.6145 16.5051 18.7128 16.5222 18.8061C16.547 18.9417 16.5983 19.0704 16.673 19.1842C16.7243 19.2624 16.7911 19.3315 16.9247 19.4697C17.5839 20.1518 17.9134 20.4928 17.9756 20.7758C18.0664 21.189 17.8984 21.6173 17.5564 21.8445C17.3223 22 16.8589 22 15.9322 22H8.54422C7.58276 22 7.10202 22 6.86265 21.8345C6.53376 21.6071 6.37205 21.1915 6.45552 20.7882C6.51627 20.4947 6.86012 20.1429 7.5478 19.4393C7.68717 19.2967 7.75685 19.2254 7.81002 19.1441C7.88297 19.0326 7.93357 18.9067 7.95876 18.7742C7.97713 18.6775 7.97713 18.5755 7.97713 18.3715V15.7159C7.97713 15.0041 7.99687 15.0367 7.51288 14.3782C4.70009 10.5509 6.17304 6.83416 8.96438 5.3968C8.96438 3.65163 9.91301 2.71288 10.824 2.24518C11.2458 2.02863 11.4567 1.92036 11.6914 2.06787C12.2414 2.4135 12.2076 4 11.9261 5C13.134 5 14.1176 6 14.1176 7L15.9886 8.88892C16.3331 9.29888 16.6738 9.72895 16.413 10.3008C16.2448 10.6696 15.8431 10.9938 15.5516 11.264C15.175 11.6132 14.5998 11.6132 14.2232 11.264C13.8813 10.9471 13.6286 10.6824 13.134 10.7787C12.7313 10.8571 12.3404 10.9941 11.9261 10.9709ZM11.9261 10.9709C11.3715 10.9399 10.7166 10.6829 10.0211 10" />
        <path d="M8 19L16 19" />
      </svg>
      <span>
        <span className="tabular-nums">
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
