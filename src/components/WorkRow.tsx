export interface WorkRole {
  desc: string;
  when: string;
  /* an upcoming role: hollow accent node, accent date */
  upcoming?: boolean;
}

export interface WorkEntry {
  name: string;
  year: string;
  /* single role */
  desc?: string;
  months?: string;
  /* several roles at one company, newest first, drawn on a vertical rail */
  roles?: WorkRole[];
}

/* Four cells in one 2x2 grid rather than two stacked columns: with
   items-baseline the grid aligns each row on its own baseline, so the months
   line sits level with the description even though the headline row mixes a
   1.2rem name with a 0.875rem year. Multi-role entries keep the same head
   row and hang the roles off a thin rail: a node per role joined by a
   hairline, so one company reads as one entry with a path through it. */
export default function WorkRow({ entry }: { entry: WorkEntry }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-5 cursor-default group">
      <div className="text-[1.2rem] font-normal text-text tracking-[0.01em] transition-colors duration-200 group-hover:text-accent">
        {entry.name}
      </div>
      <div className="text-[0.875rem] tracking-[0.1em] text-text-dim whitespace-nowrap text-right">
        {entry.year}
      </div>
      {entry.roles ? (
        <ol className="col-span-2 m-0 mt-2 list-none p-0">
          {entry.roles.map((r, i) => {
            const last = i === entry.roles!.length - 1;
            return (
              <li key={r.desc} className="relative grid grid-cols-[1fr_auto] items-baseline gap-x-6 pl-[22px]">
                {/* node */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[0.45em] h-[7px] w-[7px] rounded-full ${
                    r.upcoming ? "border-[1.25px] border-accent" : "bg-text-dim"
                  }`}
                />
                {/* hairline between this node and the next, with the same
                    clearance at both ends: node centre is at 0.45em + 3.5px
                    and the next node's centre sits 0.45em + 3.5px below
                    this item's bottom edge */}
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[3px] top-[calc(0.45em+3.5px+9px)] bottom-[calc(-0.45em-3.5px+9px)] w-px bg-text-dim/40"
                  />
                )}
                <div className={`text-[0.875rem] tracking-[0.04em] text-text-mid ${last ? "" : "pb-3"}`}>{r.desc}</div>
                <div
                  className={`text-[0.875rem] tracking-[0.04em] whitespace-nowrap text-right ${
                    r.upcoming ? "text-accent" : "text-text-dim"
                  }`}
                >
                  {r.when}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <>
          <div className="mt-1.5 text-[0.875rem] text-text-mid tracking-[0.04em]">{entry.desc}</div>
          <div className="mt-1.5 text-[0.875rem] tracking-[0.04em] text-text-dim whitespace-nowrap text-right">
            {entry.months}
          </div>
        </>
      )}
    </div>
  );
}
