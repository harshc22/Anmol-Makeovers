export default function Landing() {
  return (
    <section className="bg-background text-dark px-4 sm:px-8 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-12 items-center pt-20">
        <div>
          <h1 className="font-serif text-[14vw] leading-[0.85] tracking-tight sm:text-[10vw] lg:text-[7.5rem] mb-12">
            Enhancing Your Natural Beauty
          </h1>
          <p className="max-w-2xl font-serif text-2xl leading-[1.35] text-dark/70 md:text-[28px] mb-6 mt-6">
            I&apos;m Anmol, a certified makeup and hair artist based in the
            Greater Toronto Area, specializing in bridal, non-bridal, and
            editorial looks crafted for any occasion.{" "}
            <a
              href="/about"
              className="max-w-2xl font-serif text-2xl leading-[1.35] mb-6 text-gray-700 md:text-[28px] underline decoration-dotted underline-offset-4 border-transparent hover:border-primary hover:text-primary transition"
            >
              Read More
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a
              href="/portfolio"
              className="mx-auto flex w-full max-w-[400px] items-center justify-center rounded-full border-2 border-primary px-3 py-4 font-semibold tracking-wide transition hover:bg-accent"
            >
              View Portfolio
            </a>
            <a
              href="/booking"
              className="mx-auto flex w-full max-w-[400px] items-center justify-center rounded-full bg-primary text-white px-3 py-4 hover:bg-primaryHover font-semibold tracking-wide text-center"
            >
              Book Now
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[640px]">
            {/* Background decorative elements */}
            <div className="absolute -inset-4 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200 to-orange-200 rounded-full blur-lg"></div>
            </div>

            {/* Main frame structure */}
            <div className="relative">
              {/* Shadow/frame base */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-3xl transform rotate-1 translate-x-2 translate-y-2 shadow-2xl"></div>

              {/* White frame */}
              <div className="relative bg-accent rounded-3xl p-6 shadow-2xl transform -rotate-1">
                {/* Inner image container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src="/images/hero-model-white.png"
                    alt="Editorial beauty portrait by Anmol"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
