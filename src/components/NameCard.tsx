"use client";


/* Hover card for the Chinese name: the shanshui painting is the card, and
   the text sits in the mist on its right over a soft wash of the paper
   colour. Hierarchy, top to bottom: a small label, then the name as the
   hero with its pinyin tucked right above it, then the idiom as readable
   body text with its characters in the serif. The painting is cream in
   both themes, so the type stays ink-dark regardless of theme. */
export default function NameCard() {
  /* wash geometry and text column, tuned by eye */
  const s = { washWidth: 70, washMid: 18, midAlpha: 0.72, endAlpha: 0.9, paper: "#f6f1e9", textWidth: 58, pad: 20 };
  const rgb = s.paper.match(/[0-9a-f]{2}/gi)?.map((h) => parseInt(h, 16)).join(", ") ?? "246, 241, 233";
  const wash = `linear-gradient(to right, rgba(${rgb}, 0) 0%, rgba(${rgb}, ${s.midAlpha}) ${s.washMid}%, rgba(${rgb}, ${s.endAlpha}) 100%)`;
  const serif = "font-[family-name:var(--font-noto-serif-sc)]";
  return (
    <span className="relative block aspect-[3/2] w-full">
      <img
        src="/name-bg.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={683}
        className="absolute inset-0 h-full w-full object-cover object-left"
      />
      <span aria-hidden="true" className="absolute inset-y-0 right-0" style={{ width: `${s.washWidth}%`, backgroundImage: wash }} />
      <span
        className="absolute inset-y-0 right-0 flex flex-col text-[#1f2b35]"
        style={{ width: `${s.textWidth}%`, padding: s.pad, paddingLeft: Math.round(s.pad / 2) }}
      >
        <span className="text-[0.625rem] font-medium tracking-[0.2em] text-[#5a7284]">unofficial chinese name</span>
        <span className="flex flex-1 flex-col justify-center">
          <span className="text-[0.75rem] tracking-[0.16em] text-[#5a7284]">táng xù dōng</span>
          <span className={`${serif} mt-0.5 font-light text-[2rem] leading-[1.1] tracking-[0.1em]`} lang="zh-Hans">
            唐旭东
          </span>
          <span className="mt-3 text-[0.9375rem] leading-[1.55] tracking-[0.01em] text-[#2b3a46]">
            from the idiom{" "}
            <span lang="zh-Hans" className={`${serif} text-[1.0625rem] text-[#1f2b35]`}>
              旭日东升
            </span>
            , &ldquo;the rising sun ascends in the east&rdquo;
          </span>
        </span>
      </span>
    </span>
  );
}
