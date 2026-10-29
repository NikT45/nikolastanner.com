import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "the best decision of my life · nikolas tanner",
  description:
    "how i nearly got a business degree, and the day that changed it.",
};

/* Long-form version of the bio's "best decision" link. Same column and
   type as the home page, with the two artefacts from that summer. */
export default function Story() {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center px-6">
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

        <header className="flex flex-col gap-3">
          <h1 className="font-light text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] tracking-[-0.01em] text-text">
            the best decision of my life
          </h1>
          <p className="text-[0.875rem] tracking-[0.1em] text-text-dim">
            how i nearly got a business degree · 2024
          </p>
        </header>

        <article className="flex flex-col gap-7 text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.75] text-text-mid">
          <p>
            i strongly dislike college admissions. it has become a game. people try to game the system: if a
            major is really sought after, it&rsquo;s not good to apply for that major. so you start studying
            something you don&rsquo;t really want to.
          </p>

          <p>
            and in general, people in life will tell you that something is hard. if you believe them, you start
            to think maybe you can&rsquo;t do it. if you haven&rsquo;t really done anything hard yet, someone
            telling you something is hard is going to deter you. my freshman year ra was a computer science
            major. i asked him whether i should switch, and he said &ldquo;oh, it&rsquo;s really hard, i
            don&rsquo;t know.&rdquo; that&rsquo;s what it is: someone saying it&rsquo;s really hard, or
            implying you can&rsquo;t do it, or that you need to be good at math, or good at logic, or whatever.
            i think it&rsquo;s underestimated how much you can actually do and get done.
          </p>

          <p>
            one of the interesting things is that once you actually see these places, companies like google,
            once you&rsquo;re surrounded by the people you thought were untouchably smart, you realize that of
            course there are genuinely impressive people, but they&rsquo;re not that different from you. you can
            get extremely far, on par with most people, just by working hard and being passionate about it.
          </p>

          <p>
            by the summer after freshman year i already disliked business and was doing computer science on the
            side. but visiting google that summer was the turning point. the last straw. i visited my friend
            who was interning there, and i couldn&rsquo;t think of a reason why these interns were smarter or
            better than me. interacting with them, i didn&rsquo;t feel that way at all. that was a really big
            moment: oh, maybe it is actually possible for me to get here.
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
            i kept the visitor badge from that day and stuck it to my monitor. it stayed there for two years as
            some sort of motivation. i didn&rsquo;t really think i would actually get there. but i did.
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
