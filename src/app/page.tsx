import CardFan from "@/components/CardFan";
import CopyButton from "@/components/CopyButton";
import DiaGradient from "@/components/DiaGradient";
import HorseAnimation from "@/components/HorseAnimation";
import ImageReveal from "@/components/ImageReveal";
import { EdgeGalleryIcon, GoogleIcon, IconPill } from "@/components/InlineIcon";
import ProjectsSplit, { type SplitProject } from "@/components/ProjectsSplit";
import Tooltip from "@/components/Tooltip";
import WorkRow from "@/components/WorkRow";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center px-6">
      <DiaGradient />
      {/* Sky band: pure CSS gradients (see .sky in globals.css), kept at the
          old image's 2466x924 aspect so it sits the same on every width. */}
      <div
        aria-hidden="true"
        className="sky pointer-events-none absolute inset-x-0 top-0 z-0 h-[37.5vw] max-h-[540px]"
      />
      <aside className="relative z-10 flex w-full max-w-[640px] flex-col gap-5 border-b border-rule pb-12 pt-16 sm:pb-16 sm:pt-24">
        {/* Masthead: identity on the left, a short contact column on the
            right. Labels only; the full links live in "reach out" below. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-light text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.08] tracking-[-0.01em] text-text group cursor-default">
            nik<span className="inline-block overflow-hidden whitespace-nowrap align-bottom max-w-[3em] opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-0 group-hover:opacity-0">olas</span> tanner
          </h1>
          <p className="mt-1.5 text-[1.05rem] tracking-[0.08em] text-accent-deep">
            <Tooltip
              bgImage="/newNameBg.png"
              content={
                <>
                  my chinese name &mdash; derived from the idiom{" "}
                  <em className="italic text-accent-deep">旭日东升</em>,
                  {" "}&ldquo;the rising sun ascends in the east&rdquo;
                </>
              }
            >
              唐旭东
            </Tooltip>
          </p>
          <p className="mt-4 font-light text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.5] text-text whitespace-nowrap">
            prev swe intern @ <span className="text-accent-deep">google</span>
          </p>
        </div>
        <nav
          aria-label="contact"
          className="flex flex-row flex-wrap items-center gap-x-5 gap-y-2 sm:flex-col sm:items-end sm:gap-y-2.5 sm:pt-1"
        >
          <span className="inline-flex items-center gap-1">
            <a href="mailto:ntanner@fordham.edu" className="text-[0.875rem] tracking-[0.14em] text-text-dim no-underline transition-colors duration-200 hover:text-accent">
              email
            </a>
            <CopyButton text="ntanner@fordham.edu" label="copy email" />
          </span>
          <a href="https://github.com/NikT45" target="_blank" rel="noopener noreferrer" className="text-[0.875rem] tracking-[0.14em] text-text-dim no-underline transition-colors duration-200 hover:text-accent">
            github
          </a>
          <a href="https://linkedin.com/in/niktanner" target="_blank" rel="noopener noreferrer" className="text-[0.875rem] tracking-[0.14em] text-text-dim no-underline transition-colors duration-200 hover:text-accent">
            linkedin
          </a>
        </nav>
        </div>
        {/* <nav>
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
        </nav> */}
      </aside>

      <main className="relative z-10 flex w-full max-w-[640px] flex-col gap-14 pb-[390px] pt-14 sm:pb-[480px] sm:pt-20">
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

          <p className="w-full text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.75] text-text-mid">
            <IconPill>
              generalist
              <CardFan
                label="see what i've been up to"
                cards={[
                  {
                    caption: "music",
                    images: ["/generalist/music-1.webp", "/generalist/music-2.webp", "/generalist/music-3.webp"],
                  },
                  {
                    caption: "design",
                    images: ["/generalist/design-3.webp", "/generalist/design-1.webp", "/generalist/design-2.webp"],
                  },
                  {
                    caption: "jewelry",
                    images: [
                      "/generalist/jewelry-1.webp",
                      "/generalist/jewelry-2.webp",
                      "/generalist/jewelry-3.webp",
                      "/generalist/jewelry-4.webp",
                    ],
                  },
                ]}
              />
            </IconPill>
            , interested in design, optimistic about the future. two years ago
            i made{" "}
            <ImageReveal
              src="/decision-chat.svg"
              alt="the message i sent two years ago"
              caption="the text that started it · 2024"
              width={560}
              height={420}
            >
              the best decision of my life
            </ImageReveal>
            . previously interned at{" "}
            <IconPill>
              google
              <GoogleIcon />
            </IconPill>{" "}
            where i got to build an ai consumer product end to end for the{" "}
            <span>
              ai edge gallery{" "}
              <IconPill>
                team
                <EdgeGalleryIcon />
              </IconPill>
              .
            </span>
          </p>
        </section>

        <section id="work" className="scroll-mt-18 border-t border-rule pt-14">
          <p className="text-[1.4rem] font-light text-accent-deep mb-10">work</p>
          <div className="flex flex-col">
            {([
              { name: "google", desc: "swe intern, worked on ai edge gallery, a consumer app for on-device ai", year: "2026", months: "may – aug · 14 wks" },
              { name: "habits inc.", desc: "internal dashboard", year: "2025", months: "feb – apr · 12 wks" },
            ] as { name: string; desc: string; year: string; months?: string }[]).map((p) => (
              <WorkRow key={p.name} entry={p} />
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-18 border-t border-rule pt-14">
          <ProjectsSplit
            heading="projects"
            projects={[
              {
                name: "nimbit",
                desc: "chrome extension that finishes your emails as you type. ghost-text completions you accept with tab",
                video: "/projects/final/nimbit.mp4",
                poster: "/projects/final/nimbit.jpg",
                href: "https://www.usenimbit.com",
                linkLabel: "usenimbit.com",
              },
              {
                name: "bond",
                desc: "one question a day for couples. both answer, seal, then read each other. native swiftui",
                video: "/projects/final/bond.mp4",
                poster: "/projects/final/bond.jpg",
                href: "https://bondcouples.com",
                linkLabel: "bondcouples.com",
              },
              {
                name: "crestnotes",
                desc: "meeting tool for customer success. records locally so no bot joins the call, then drafts your follow-up email",
                video: "/projects/final/crestnotes.mp4",
                poster: "/projects/final/crestnotes.jpg",
                href: "https://crestnotes.com",
                linkLabel: "crestnotes.com",
              },
            ] satisfies SplitProject[]}
          />
        </section>

        {/* Rule is hidden on mobile: the horse sits above this section's top
            edge there and the divider cuts straight through it. */}
        <section id="contact" className="scroll-mt-18 relative border-rule pt-14 sm:border-t">
          <HorseAnimation className="absolute -top-10 right-0 sm:top-auto sm:bottom-0" />
          <p className="text-[1.4rem] font-light text-accent-deep mb-10">
            reach out
          </p>
          <div className="flex flex-col gap-[18px]">
            <div className="flex items-baseline gap-5">
              <span className="text-[0.875rem] tracking-[0.18em] text-text-dim w-20 shrink-0">email</span>
              <span className="inline-flex items-center gap-1.5">
                <a href="mailto:ntanner@fordham.edu" className="text-[0.92rem] text-text no-underline border-b border-underline pb-px transition-colors duration-200 hover:text-accent hover:border-accent">
                  ntanner@fordham.edu
                </a>
                <CopyButton text="ntanner@fordham.edu" label="copy email" />
              </span>
            </div>
            <div className="flex items-baseline gap-5">
              <span className="text-[0.875rem] tracking-[0.18em] text-text-dim w-20 shrink-0">github</span>
              <a href="https://github.com/NikT45" target="_blank" rel="noopener noreferrer" className="text-[0.92rem] text-text no-underline border-b border-underline pb-px transition-colors duration-200 hover:text-accent hover:border-accent">
                github.com/NikT45
              </a>
            </div>
            <div className="flex items-baseline gap-5">
              <span className="text-[0.875rem] tracking-[0.18em] text-text-dim w-20 shrink-0">linkedin</span>
              <a href="https://linkedin.com/in/niktanner" target="_blank" rel="noopener noreferrer" className="text-[0.92rem] text-text no-underline border-b border-underline pb-px transition-colors duration-200 hover:text-accent hover:border-accent">
                linkedin.com/in/niktanner
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
