import Image from 'next/image'

export default function Home() {
  return (
    <section className="bg-background text-dark px-4 sm:px-8 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold mb-6 leading-tight">
            Enhancing Your Natural Beauty
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
            I'm Anmol, a certified makeup and hair artist based in the Greater Toronto Area, specializing in bridal, non-bridal, and editorial looks crafted for any occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a
              href="/portfolio"
              className="border-2 border-primary text-dark px-6 py-3 rounded-md hover:bg-accent text-center"
            >
              View Portfolio
            </a>
            <a
              href="/booking"
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primaryHover text-center"
            >
              Book Now
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/hero-model.jpg"
            alt="Makeup model"
            width={500}
            height={600}
            className="rounded-lg object-cover w-full max-w-xs sm:max-w-md md:max-w-lg"
          />
        </div>
      </div>
    </section>
  )
}
