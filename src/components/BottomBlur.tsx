/* Progressive blur: stacked backdrop-filter layers, each blurring harder but
   masked tighter to the bottom edge. Backdrop filters compound, so the bottom
   ramps to ~15px of blur while the top edge stays perfectly sharp. A single
   flat blur layer would leave a visible seam where the filter stops. */
const LAYERS = [
  { blur: 1, mask: "linear-gradient(to top, #000 0%, #000 25%, transparent 100%)" },
  { blur: 2, mask: "linear-gradient(to top, #000 0%, #000 15%, transparent 65%)" },
  { blur: 4, mask: "linear-gradient(to top, #000 0%, #000 10%, transparent 40%)" },
  { blur: 8, mask: "linear-gradient(to top, #000 0%, #000 5%, transparent 22%)" },
];

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
