/* Chess.com public API, read at render time and cached for an hour. */

const USER = "nikt0405";
const UA = "nikolastanner.com (personal site; ntanner@fordham.edu)";

export interface ChessData {
  username: string;
  url: string;
  rating: number;
  best: number;
  wins: number;
  losses: number;
  draws: number;
  /* rapid rating after each of the most recent games, oldest first */
  series: number[];
  /* unix seconds of the most recent rapid game */
  lastPlayed: number;
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.chess.com/pub/player/${USER}${path}`, {
      headers: { "User-Agent": UA },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface Stats {
  chess_rapid?: {
    last: { rating: number };
    best: { rating: number };
    record: { win: number; loss: number; draw: number };
  };
}
interface Game {
  end_time: number;
  time_class: string;
  white: { username: string; rating: number };
  black: { username: string; rating: number };
}

export async function getChess(points = 120): Promise<ChessData | null> {
  const [stats, archives] = await Promise.all([
    get<Stats>("/stats"),
    get<{ archives: string[] }>("/games/archives"),
  ]);
  const rapid = stats?.chess_rapid;
  if (!rapid) return null;

  /* walk back through monthly archives until there are enough rapid games */
  const months = (archives?.archives ?? []).slice(-6).reverse();
  const games: Game[] = [];
  for (const url of months) {
    const m = await get<{ games: Game[] }>(
      url.replace(`https://api.chess.com/pub/player/${USER}`, ""),
    );
    if (m) games.push(...m.games.filter((g) => g.time_class === "rapid"));
    if (games.length >= points) break;
  }
  games.sort((a, b) => a.end_time - b.end_time);
  const recent = games.slice(-points);
  const series = recent.map((g) =>
    g.white.username.toLowerCase() === USER ? g.white.rating : g.black.rating,
  );

  return {
    username: USER,
    url: `https://www.chess.com/member/${USER}`,
    rating: rapid.last.rating,
    best: rapid.best.rating,
    wins: rapid.record.win,
    losses: rapid.record.loss,
    draws: rapid.record.draw,
    series,
    lastPlayed: recent.at(-1)?.end_time ?? 0,
  };
}
