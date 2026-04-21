import HorseAnimation from "@/components/HorseAnimation";
import Tooltip from "@/components/Tooltip";
import WorkRow from "@/components/WorkRow";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen px-6">
      <aside className="w-full max-w-[480px] pt-16 pb-12 sm:pt-24 sm:pb-16 border-b border-rule flex flex-col gap-5">
        <div>
          <h1 className="font-light text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.08] tracking-[-0.01em] text-text group cursor-default">
            nik<span className="inline-block overflow-hidden whitespace-nowrap align-bottom max-w-[3em] opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-0 group-hover:opacity-0">olas</span> tanner
          </h1>
          <p className="mt-1.5 text-[1.05rem] tracking-[0.08em] text-accent-deep">
            <Tooltip
              sun
              content={
                <>
                  my chinese name &mdash; derived from the idiom{" "}
                  <em className="italic text-accent-deep">旭日东升</em>
                </>
              }
            >
              唐旭东
            </Tooltip>
          </p>
          <p className="mt-4 font-light text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.5] text-text whitespace-nowrap">
            incoming software engineering intern @ <span className="text-accent-deep">google</span>
          </p>
        </div>
        <nav>
          <ul className="list-none flex flex-row gap-7 p-0 m-0">
            <li>
              <a href="#work" className="text-[0.875rem] tracking-[0.14em] text-text-dim no-underline transition-colors duration-200 hover:text-accent">
                work
              </a>
            </li>
            <li>
              <a href="#contact" className="text-[0.875rem] tracking-[0.14em] text-text-dim no-underline transition-colors duration-200 hover:text-accent">
                contact
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="w-full max-w-[480px] pt-14 pb-[100px] sm:pt-20 sm:pb-[140px] flex flex-col gap-20">
        <section id="about" className="scroll-mt-18">
          {/* Portrait — uncomment to show
          <div className="w-full">
            <div className="relative inline-block w-[52%] p-[14px] border border-rule outline outline-4 outline-bg [outline-offset:-14px]">
              <Image
                src="/formal.jpg"
                alt="Nikolas Tanner"
                width={480}
                height={640}
                priority
                className="w-full h-auto aspect-[3/4] object-cover block"
              />
            </div>
          </div>
          */}

          <p className="text-[0.88rem] leading-[1.85] text-text-mid max-w-[44ch]">
            studying computer science and interning at google this summer on the on-device machine learning team.
            working towards building a company.
          </p>
        </section>

        <section id="work" className="scroll-mt-18">
          <p className="text-[0.875rem] tracking-[0.2em] text-accent mb-7">work</p>
          <div className="flex flex-col">
            {([
              { name: "google", desc: "software engineering intern, on-device machine learning team", year: "incoming summer 2026" },
              { name: "habits inc.", desc: "internal dashboard", year: "2025", months: "feb 2025 – apr 2025 · 3 mos" },
            ] as { name: string; desc: string; year: string; months?: string }[]).map((p) => (
              <WorkRow key={p.name} entry={p} />
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-18 relative">
          <HorseAnimation className="absolute -top-10 right-0 sm:top-auto sm:bottom-0" />
          <p className="text-[1.4rem] font-light text-accent-deep mb-10">
            let&apos;s build
          </p>
          <div className="flex flex-col gap-[18px]">
            <div className="flex items-baseline gap-5">
              <span className="text-[0.875rem] tracking-[0.18em] text-text-dim w-20 shrink-0">email</span>
              <a href="mailto:ntanner@fordham.edu" className="text-[0.92rem] text-text no-underline border-b border-rule pb-px transition-colors duration-200 hover:text-accent hover:border-accent">
                ntanner@fordham.edu
              </a>
            </div>
            <div className="flex items-baseline gap-5">
              <span className="text-[0.875rem] tracking-[0.18em] text-text-dim w-20 shrink-0">github</span>
              <a href="https://github.com/NikT45" target="_blank" rel="noopener noreferrer" className="text-[0.92rem] text-text no-underline border-b border-rule pb-px transition-colors duration-200 hover:text-accent hover:border-accent">
                github.com/NikT45
              </a>
            </div>
            <div className="flex items-baseline gap-5">
              <span className="text-[0.875rem] tracking-[0.18em] text-text-dim w-20 shrink-0">linkedin</span>
              <a href="https://linkedin.com/in/niktanner" target="_blank" rel="noopener noreferrer" className="text-[0.92rem] text-text no-underline border-b border-rule pb-px transition-colors duration-200 hover:text-accent hover:border-accent">
                linkedin.com/in/niktanner
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
