interface Entry {
  name: string;
  desc: string;
  year: string;
  months?: string;
}

/* Four cells in one 2x2 grid rather than two stacked columns: with
   items-baseline the grid aligns each row on its own baseline, so the months
   line sits level with the description even though the headline row mixes a
   1.2rem name with a 0.875rem year. */
export default function WorkRow({ entry }: { entry: Entry }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-5 cursor-default group">
      <div className="text-[1.2rem] font-normal text-text tracking-[0.01em] transition-colors duration-200 group-hover:text-accent">
        {entry.name}
      </div>
      <div className="text-[0.875rem] tracking-[0.1em] text-text-dim whitespace-nowrap text-right">
        {entry.year}
      </div>
      <div className="mt-1.5 text-[0.875rem] text-text-mid tracking-[0.04em]">
        {entry.desc}
      </div>
      <div className="mt-1.5 text-[0.875rem] tracking-[0.04em] text-text-dim whitespace-nowrap text-right">
        {entry.months}
      </div>
    </div>
  );
}
