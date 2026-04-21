import fs from "node:fs/promises";
import path from "node:path";
import HorseFrames from "./HorseFrames";

export default async function HorseAnimation({ className }: { className?: string }) {
  const dir = path.join(process.cwd(), "public/horse");
  const files = await fs.readdir(dir);
  const frameNum = (name: string) => {
    const m = name.match(/\((\d+)\)/);
    return m ? parseInt(m[1], 10) : 0;
  };
  const txtFiles = files
    .filter((f) => f.endsWith(".txt"))
    .sort((a, b) => frameNum(b) - frameNum(a));
  const frames = await Promise.all(
    txtFiles.map((f) => fs.readFile(path.join(dir, f), "utf-8")),
  );
  return <HorseFrames frames={frames} className={className} />;
}
