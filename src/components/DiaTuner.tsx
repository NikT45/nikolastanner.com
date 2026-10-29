"use client";

import { useState } from "react";
import {
  DEFAULTS,
  resetDiaSettings,
  setDiaSettings,
  useDiaSettings,
  type DiaSettings,
} from "./diaSettings";

type NumKey = Exclude<keyof DiaSettings, "stops">;

const CONTROLS: {
  key: NumKey;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: "count", label: "bars", min: 3, max: 25, step: 1 },
  { key: "valley", label: "edge height", min: 0.1, max: 1, step: 0.01 },
  { key: "peak", label: "centre height", min: 0.1, max: 1, step: 0.01 },
  { key: "curve", label: "curve", min: 0.3, max: 4, step: 0.05 },
  { key: "overhang", label: "overhang", min: 0, max: 300, step: 5 },
  {
    key: "lightWidth",
    label: "light · bar width ×",
    min: 0.6,
    max: 2.5,
    step: 0.01,
  },
  { key: "lightBlur", label: "light · blur", min: 0, max: 80, step: 1 },
  {
    key: "darkFeather",
    label: "dark · side feather",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "darkTop", label: "dark · top feather %", min: 0, max: 60, step: 1 },
];

/* Dev-only panel for tuning the footer gradient live. Rendered from layout
   only when NODE_ENV is development. "copy" puts the settings on the
   clipboard as JSON to paste back. */
export default function DiaTuner() {
  const s = useDiaSettings();
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(s, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const setStop = (i: number, v: number) => {
    const stops = [...s.stops] as DiaSettings["stops"];
    stops[i] = v;
    setDiaSettings({ stops });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-16 left-4 z-50 rounded-md bg-text px-2 py-1 font-mono text-[11px] text-bg"
      >
        dia
      </button>
    );
  }

  return (
    <div className="fixed bottom-16 left-4 z-50 w-[270px] rounded-lg border border-rule bg-bg/95 p-3 font-mono text-[11px] text-text shadow-lg backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="tracking-[0.1em] text-text-dim">dia tuner · dev</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={resetDiaSettings}
            className="rounded px-1.5 py-0.5 hover:bg-bg-subtle"
          >
            reset
          </button>
          <button
            type="button"
            onClick={copy}
            className="rounded bg-accent px-1.5 py-0.5 text-bg"
          >
            {copied ? "copied" : "copy"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded px-1.5 py-0.5 hover:bg-bg-subtle"
          >
            ×
          </button>
        </div>
      </div>
      {CONTROLS.map((c) => (
        <label key={c.key} className="mb-1.5 block">
          <span className="flex justify-between">
            <span>{c.label}</span>
            <span className="text-text-dim">
              {s[c.key]}
              {s[c.key] !== DEFAULTS[c.key] ? " *" : ""}
            </span>
          </span>
          <input
            type="range"
            min={c.min}
            max={c.max}
            step={c.step}
            value={s[c.key]}
            onChange={(e) =>
              setDiaSettings({
                [c.key]: Number(e.target.value),
              } as Partial<DiaSettings>)
            }
            className="w-full accent-accent"
          />
        </label>
      ))}
      <div className="mt-2 border-t border-rule pt-2 text-text-dim">
        stop offsets, % from bottom
      </div>
      {s.stops.map((v, i) => (
        <label key={i} className="mb-1 block">
          <span className="flex justify-between">
            <span>stop {i + 1}</span>
            <span className="text-text-dim">{v}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={v}
            onChange={(e) => setStop(i, Number(e.target.value))}
            className="w-full accent-accent"
          />
        </label>
      ))}
    </div>
  );
}
