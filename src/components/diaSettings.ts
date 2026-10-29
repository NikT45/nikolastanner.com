"use client";

import { useSyncExternalStore } from "react";

/* Geometry of the footer "dia" gradient, shared by the light (SVG blur) and
   dark (gradient bars) renderers. The dev-only DiaTuner writes to this store
   so the bars can be tweaked live; production only ever reads DEFAULTS. */
export interface DiaSettings {
  /* number of bars across the width */
  count: number;
  /* edge bar height as a fraction of the box */
  valley: number;
  /* centre bar height as a fraction of the box */
  peak: number;
  /* falloff exponent from centre to edge; 1 = linear, >1 = flatter middle */
  curve: number;
  /* extra height below the page edge, in viewBox units */
  overhang: number;
  /* gradient stop offsets 1..5 as percentages from the bottom (0 and 100 fixed) */
  stops: [number, number, number, number, number];
  /* light: bar width as a multiple of the cell, and the SVG blur radius */
  lightWidth: number;
  lightBlur: number;
  /* dark: side feather as a fraction of the cell, top feather as % of bar height */
  darkFeather: number;
  darkTop: number;
}

export const DEFAULTS: DiaSettings = {
  count: 11,
  valley: 0.48,
  peak: 0.98,
  curve: 1.3,
  overhang: 80,
  stops: [12.02, 24.52, 36.06, 48.08, 66.35],
  lightWidth: 1.22,
  lightBlur: 18,
  darkFeather: 0.45,
  darkTop: 14,
};

let current: DiaSettings = DEFAULTS;
const listeners = new Set<() => void>();

export function setDiaSettings(patch: Partial<DiaSettings>) {
  current = { ...current, ...patch };
  listeners.forEach((l) => l());
}

export function resetDiaSettings() {
  current = DEFAULTS;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useDiaSettings(): DiaSettings {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULTS,
  );
}
