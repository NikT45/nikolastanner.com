import fs from "node:fs/promises";
import path from "node:path";
import HorseFrames from "./HorseFrames";

export default async function HorseAnimation({ className }: { className?: string }) {
  const dir = path.join(process.cwd(), "public/horse_new");
  const files = await fs.readdir(dir);
  const frameNum = (name: string) => {
    const m = name.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };
  const txtFiles = files
    .filter((f) => f.endsWith(".txt"))
    .sort((a, b) => frameNum(a) - frameNum(b));
  const raw = await Promise.all(
    txtFiles.map((f) => fs.readFile(path.join(dir, f), "utf-8")),
  );
  const maxLines = Math.max(...raw.map((f) => f.split("\n").length));
  const frames = raw.map((f) => {
    const lines = f.split("\n");
    while (lines.length < maxLines) lines.push("");
    return lines.join("\n");
  });
  return <HorseFrames frames={frames} className={className} />;
}
