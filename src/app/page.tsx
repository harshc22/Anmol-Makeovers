import Image from 'next/image'
export default function Home() {
  return (
    <section className="bg-background text-dark px-4 sm:px-8 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-12 items-center pt-20">
        <div>
          <h1 className="font-serif text-[14vw] leading-[0.85] tracking-tight  sm:text-[10vw] lg:text-[7.5rem] mb-12 mt-6">
            Enhancing Your Natural Beauty
          </h1>
          <p className="max-w-2xl font-serif text-2xl leading-[1.35] text-dark/70 md:text-[28px] mb-6 mt-6">
            I&apos;m Anmol, a certified makeup and hair artist based in the Greater Toronto Area, specializing in bridal, non-bridal, and editorial looks crafted for any occasion.{' '}
            <a
              href="/about"
              className="max-w-2xl font-serif text-2xl leading-[1.35] mb-6 text-gray-700 md:text-[28px] underline decoration-dotted underline-offset-4  border-transparent hover:border-primary hover:text-primary transition"
            >
              Read More
            </a>

          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a
              href="/portfolio"
              className="mx-auto flex w-full max-w-[400px] items-center justify-center rounded-full border-2 border-primary px-3 py-4 text-sm font-semibold tracking-wide text-heading transition hover:bg-accent"
            >
              View Portfolio
            </a>
            <a
              href="/booking"
              className="mx-auto flex w-full max-w-[400px] items-center justify-center rounded-full bg-primary text-white px-3 py-4 hover:bg-primaryHover font-semibold tracking-wide  text-center"
            >
              Book Now
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[640px] overflow-hidden rounded-[48px] bg-accent p-6 md:p-8">
            <div
              className="relative h-full w-full overflow-hidden rounded-[56px]"
              style={{
                clipPath:
                  'path("M40 0 Q0 0 0 40 V560 Q0 600 40 600 H440 Q480 600 480 560 V40 Q480 0 440 0 Z")',
              }}
            >
              <Image
                src="/images/hero-model.jpg"
                alt="Editorial beauty portrait by Anmol"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* decorative corner circle */}
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border-2 border-gray/40" />
          </div>
        </div>
      </div>
    </section>
  )
}
