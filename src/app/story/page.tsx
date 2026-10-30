import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "the best decision of my life · nikolas tanner",
  description: "how i ended up switching to computer science.",
};

/* Long-form version of the bio's "best decision" link. Same column and
   type as the home page, with the two artefacts from that summer. */
export default function Story() {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-x-clip px-6">
      <div
        aria-hidden="true"
        className="sky pointer-events-none absolute inset-x-0 top-0 z-0 h-[37.5vw] max-h-[540px]"
      />

      <main className="relative z-10 flex w-full max-w-[640px] flex-col gap-10 pb-32 pt-16 sm:pt-24">
        <Link
          href="/"
          className="self-start text-[0.875rem] tracking-[0.14em] text-text-dim no-underline transition-colors duration-200 hover:text-accent"
        >
          &larr; back
        </Link>

        <header>
          <h1 className="font-light text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] tracking-[-0.01em] text-text">
            the best decision of my life
          </h1>
        </header>

        <article className="flex flex-col gap-7 text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.75] text-text-mid">
          <p>
            i thought computer science was too hard for me, and that i wasn&rsquo;t smart enough. people
            told me the same.
          </p>

          <p>
            visiting a friend interning at google was the final straw. the interns were good, but they
            didn&rsquo;t feel like a different kind of person. i could see myself there.
          </p>

          <figure className="flex flex-col gap-3">
            <img
              src="/best-decision.webp"
              alt="family chat: me saying i'm thinking of switching to computer science because studying business is boring, and a reply that not everything is interesting"
              width={800}
              height={845}
              className="mx-auto w-[min(100%,420px)] rounded-xl border border-rule"
            />
            <figcaption className="text-center text-[0.8125rem] tracking-[0.06em] text-text-dim">
              the text i sent the family chat after.
            </figcaption>
          </figure>

          <p>
            that summer i switched to computer science and stuck the guest badge to my monitor. it stayed
            there for two years. i never expected to end up joining full-time.
          </p>

          <figure className="flex flex-col gap-3">
            <img
              src="/guest-badge.webp"
              alt="my google guest badge from that visit, worn and taped, dated 08/12"
              width={1024}
              height={979}
              className="mx-auto w-[min(100%,360px)] drop-shadow-[0_12px_28px_rgba(26,15,30,0.25)]"
            />
            <figcaption className="text-center text-[0.8125rem] tracking-[0.06em] text-text-dim">
              the badge. two years on a monitor.
            </figcaption>
          </figure>
        </article>
      </main>
    </div>
  );
}
