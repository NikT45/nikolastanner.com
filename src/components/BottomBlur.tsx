/* Progressive blur: a stack of backdrop-filter layers, each doubling the blur
   of the one before and masked to its own horizontal band. Every band fades
   in over one step, holds for one, and fades out over the next, so it is
   always crossfading into a neighbour that is already at full strength.
   The result ramps from perfectly sharp at the top edge to PEAK_BLUR at the
   bottom with no visible seam, where a single flat layer (or layers that all
   pile up on the bottom edge) reads as one uniform smear. */
const PEAK_BLUR = 16;
const LAYER_COUNT = 6;
const STEP = 100 / LAYER_COUNT;

const LAYERS = Array.from({ length: LAYER_COUNT }, (_, i) => {
  const stop = (n: number) => `${Math.min(100, (i + n) * STEP).toFixed(2)}%`;
  return {
    blur: PEAK_BLUR / 2 ** (LAYER_COUNT - 1 - i),
    mask: `linear-gradient(to bottom, transparent ${stop(0)}, #000 ${stop(1)}, #000 ${stop(2)}, transparent ${stop(3)})`,
  };
});

export default function BottomBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[90px] sm:h-[130px]"
    >
      {LAYERS.map((layer) => (
        <div
          key={layer.blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
    </div>
  );
}
