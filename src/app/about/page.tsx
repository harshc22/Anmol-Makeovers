"use client";

import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-heading">
      {/* Top border line */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <div className="h-px w-full border-t border-gray" />
      </div>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-20 pt-10 lg:grid-cols-2 lg:pt-16">
        {/* Left: Type-led intro */}
        <div className="order-2 space-y-10 lg:order-1">
          <div>
            <h1 className="font-serif text-[18vw] leading-[0.85] tracking-tight text-heading sm:text-[14vw] lg:text-[8.5rem]">
              ANMOL
            </h1>
            <p className="mt-6 font-medium tracking-wide text-heading">
              MAKEUP ARTIST &amp; HAIR STYLIST
            </p>
          </div>

          <p className="max-w-2xl font-serif text-2xl leading-[1.35] text-dark md:text-[28px]">
            I believe makeup turns the abstract into confidence,
            character, mood. My work is a conversation between artist and
            client, designed to last through long days, bright lights, and the
            memories that follow.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[36px] sm:rounded-[48px] bg-accent mt-10 sm:mt-10 p-4 sm:p-6">
            {/* Inner wrapper holds the aspect ratio so padding doesn't break the frame */}
            <div
              className="
        relative w-full aspect-[4/5] overflow-hidden rounded-[28px] sm:rounded-[56px]
        lg:[clip-path:path('M40 0 Q0 0 0 40 V560 Q0 600 40 600 H440 Q480 600 480 560 V40 Q480 0 440 0 Z')]
      "
            >
              <Image
                src="/images/about-1.jpg"
                alt="Editorial beauty portrait by Anmol"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="h-px w-full border-t border-gray" />
        <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="text-xs tracking-[0.18em] text-dark/70">PHILOSOPHY</p>
          </div>
          <div className="md:col-span-9">
            <p className="font-serif text-2xl leading-[1.35] text-dark md:text-[28px]">
              Beauty should feel like you: effortless, elegant, and
              comfortable. I listen first, then design a look that enhances your
              natural features with skin-forward techniques, photo-friendly
              finishes, and long wear in mind.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES + CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="h-px w-full border-t border-gray" />
        <div className="grid grid-cols-1 items-start gap-8 pt-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="text-xs tracking-[0.18em] text-dark/70">SERVICES</p>
          </div>

          <div className="md:col-span-6">
            <p className="font-serif text-2xl leading-[1.35] text-dark md:text-[28px]">
              Ready to tell your story? Browse available services, then book a
              free consultation. Let&apos;s bring your beauty vision to life.
            </p>

            <ul className="mt-8 divide-y divide-gray border-y border-gray">
              {[
                "Bridal makeup & hair",
                "Engagement / pre-wedding looks",
                "Editorial / photoshoot glam",
                "Event & party styling",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between py-5 text-dark/70 hover:bg-[#ff2e63]/5 border-gray"
                >
                  <span className="font-medium">{item}</span>
                  <span className="text-sm opacity-60">→</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <Link
              href="/booking"
              className="mx-auto flex w-full max-w-[220px] items-center justify-center rounded-full border-2 border-primary px-6 py-4 text-sm font-semibold tracking-wide text-heading transition hover:bg-accent hover:text-light"
            >
              BOOK ME
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/beauty-1.jpg"
              alt="Soft glam portrait"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/beauty-2.jpg"
              alt="Editorial beauty closeup"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* BIG CTA BAND */}
      <section className="relative overflow-hidden bg-white py-16">
        <Marquee
          gradient={true}
          gradientWidth={100}
          speed={100}
          className="font-serif uppercase tracking-tight text-dark text-[12vw] md:text-[7rem] leading-none"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="mx-8">
              See you soon
            </span>
          ))}
        </Marquee>
      </section>
    </main>
  );
}
